import './style.css';

import { collection, doc, addDoc, setDoc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import firestore from './firebase.js';


const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
    iceCandidatePoolSize: 10,
};

// Global State
let pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;


const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');



// 1. Setup media sources

webcamButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    callButton.disabled = false;
    answerButton.disabled = false;
    webcamButton.disabled = true; 
};


// 2. Create an offer
callButton.onclick = async () => {
    // Reference Firestore collection
    const callDoc = doc(collection(firestore, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    callInput.value = callDoc.id;
    console.log("callDoc.id:");
    console.log(callDoc.id);


    // Get candidate for caller, save to db
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
          await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    console.log("offerDescription:");
    console.log(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });


    // Listen for remote answer
    onSnapshot(callDoc, (snapshot) => {
        // The on snapshot method will fire a callback anytime the document in the database changes
        const data = snapshot.data();
        // If our peer connection doesn't have a current remote description and the data has an answer 
        // then we'll go ahead and set an answer description on our peer connection here locally
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    hangupButton.disabled = false;
    callButton.disabled = true;
    answerButton.disabled = true;
    webcamButton.disabled = true;
};


// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
    // Reference Firestore collection
    const callId = callInput.value;
    const callDoc = doc(collection(firestore, 'calls'), callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');
    
    // Get candidate for answerer, save to db
    pc.onicecandidate = event => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    // Get offer from caller
    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
    console.log("caller offerDescription:");
    console.log(offerDescription);

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);
    console.log("caller answerDescription:");
    console.log(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log("change:");
            console.log(change);
            if (change.type === 'added') {
                let data = change.doc.data();
                console.log("data:");
                console.log(data);
                pc.addIceCandidate(new RTCIceCandidate(data));
                console.log("added ice candidate");
            }
        });
    });

    hangupButton.disabled = false;
    callButton.disabled = true;
    answerButton.disabled = true;
    webcamButton.disabled = true;
};


// 4. Hang up
// Close the peer connection and stop the media tracks
hangupButton.onclick = async () => {
  // Close the peer connection
  pc.close();
  pc = new RTCPeerConnection(servers);

  // Stop all local media tracks
  localStream.getTracks().forEach((track) => track.stop());
  remoteStream.getTracks().forEach((track) => track.stop());

  // Reset the video elements
  webcamVideo.srcObject = null;
  remoteVideo.srcObject = null;

  // Disable buttons
  callButton.disabled = true;
  answerButton.disabled = true;
  hangupButton.disabled = true;
  webcamButton.disabled = false;

  // Optionally, delete the call document from Firestore
  const callId = callInput.value;
  if (callId) {
      const callDoc = doc(collection(firestore, 'calls'), callId);
      await callDoc.delete().catch((error) => {
          console.error("Error deleting call document:", error);
      });
  }

  // Clear the call input field
  callInput.value = '';
};