import './style.css';

import { collection, doc, addDoc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import firestore from './firebase.js';

// NOTE: Connection Setup
// STUN server configuration for WebRTC
const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
    iceCandidatePoolSize: 10,
};

// Global State
/** 
 * @type {RTCPeerConnection} - The RTCPeerConnection object represents a connection between the local computer and a remote peer.
*/
let peerConnection = new RTCPeerConnection(servers);
/**
 * @type {MediaStream | null} localStream - The local media stream (e.g., the user's webcam and microphone).
*/
let localStream = null;
/**
 * @type {MediaStream | null} remoteStream - The remote media stream (e.g., the other user's webcam and microphone).
 */ 
let remoteStream = null;

// DOM Elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');


// NOTE: Media Capture
// 1. Setup media sources
webcamButton.onclick = async () => {
    console.log("Setting up media sources...");
    // Request access to the user's webcam and microphone
    console.log("Requesting access to your webcam and microphone...");
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    remoteStream = new MediaStream();
    console.log("Access granted! Preparing your local video and audio streams...");
    // NOTE: Peer-to-Peer - Local Tracks
    // Add local tracks (video/audio) to the peer connection
    localStream.getTracks().forEach((track) => {
      console.log(`Adding local "${track.kind}" track to the connection:`, track);
      peerConnection.addTrack(track, localStream);
    });

    // NOTE: Peer-to-Peer - Remote Tracks
    // Handle incoming remote tracks and add them to the remote stream
    peerConnection.ontrack = event => {
      console.log("Receiving video/audio from the other person...");
      event.streams[0].getTracks().forEach(track => {
        console.log(`Adding remote "${track.kind}" track to the remote stream:`, track);
        remoteStream.addTrack(track);
      });
    };

    // Display local and remote streams in the video elements
    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    console.log("Your video and audio are ready! You can now create or join a call.");
    // Enable call and answer buttons and disable webcam button
    callButton.disabled = false;
    answerButton.disabled = false;
    webcamButton.disabled = true;

    console.log("Media sources set up successfully.");
};


// NOTE: Signaling - Caller
// 2. Create an offer
callButton.onclick = async () => {
    console.log("Creating an offer / a new call...");
    // Reference Firestore collection
    const callDoc = doc(collection(firestore, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    callInput.value = callDoc.id;
    console.log(`Call created! Share this call ID with the other person: ${callDoc.id}`);


    // Collect ICE candidates for the caller and save them to Firestore
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
          console.log("Saving ICE candidate...");
          await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    // Create an SDP offer and set it as the local description
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);
    console.log("Sending your connection details (SDP offer) to the other person...");

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    // Save the offer to Firestore
    await setDoc(callDoc, { offer });
    console.log("Connection details (SDP offer) sent to Firestore:", offer);


    // Listen for remote answer
    onSnapshot(callDoc, (snapshot) => {
        // The on snapshot method will fire a callback anytime the document in the database changes
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data?.answer) {
          console.log("Received SDP answer. The other person has accepted your call! Setting up the connection...");
          const answerDescription = new RTCSessionDescription(data.answer);

          // Group the SDP answer details (collapsed by default)
          console.groupCollapsed("SDP Answer (Receiver)");
          console.log(data.answer.sdp);
          console.groupEnd();

          // IMPORTANT: 1. When the caller receives the answer, they set the remote description with the answer
          console.log("Setting remote description with the answer...");
          peerConnection.setRemoteDescription(answerDescription);

          // Final summary log for the caller
          console.log("Connection successful! The browsers are now communicating using the following details:");
          console.groupCollapsed("Connection Details");
          console.log("SDP Offer (Caller):", offerDescription.sdp);
          console.log("SDP Answer (Receiver):", data.answer.sdp);
          console.log("ICE Candidates are being exchanged to establish the best communication path.");
          console.groupEnd();
          console.log("Enjoy your call!");
          
      }
    });

    // Listen for ICE candidates from the answerer and add them to the peer connection
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          console.log("Adding ICE candidate from the other person.");
          peerConnection.addIceCandidate(candidate);
        }
      });
    });

    hangupButton.disabled = false;
    callButton.disabled = true;
    answerButton.disabled = true;
    webcamButton.disabled = true;

    console.log("Offer created and sent successfully.");
    console.log("Your call is ready! Waiting for the other person to join...");
};


// NOTE: Signaling - Receiver
// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
    console.log("Answering/joining the call...");
    // Reference Firestore collection
    const callId = callInput.value;
    const callDoc = doc(collection(firestore, 'calls'), callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');
    
    // Collect ICE candidates for the answerer and save them to Firestore
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Saving ICE candidate...");
            addDoc(answerCandidates, event.candidate.toJSON());
        }
    };

    // Get the offer from the caller
    const callData = (await getDoc(callDoc)).data();
    const offerDescription = callData.offer;
    console.log("Received connection details (SDP offer) from the caller:", offerDescription);
    console.log("Setting up the connection...");
    // IMPORTANT: 2. When the receiver answers the call, they set the remote description with the offer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Create an SDP answer and set it as the local description
    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);
    console.log("Sending your connection details (SDP answer) back to the other person...");
    

    // Save the answer to Firestore
    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };
    await updateDoc(callDoc, { answer });
    console.log("Connection details (SDP answer) sent to the caller:", answer);

    // Listen for ICE candidates from the caller
    onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                console.log("Adding ICE candidate from the caller.");
                peerConnection.addIceCandidate(candidate);
            }
        });
    });

    console.log("You are now connected! You can see and hear the other person.");
    hangupButton.disabled = false;
    callButton.disabled = true;
    answerButton.disabled = true;
    webcamButton.disabled = true;

    console.log("Call answered successfully.");

    // Final summary log
    console.log("Connection successful! The browsers are now communicating using the following details:");
    console.groupCollapsed("Connection Details");
    console.log("SDP Offer (Caller):", offerDescription.sdp);
    console.log("SDP Answer (Receiver):", answerDescription.sdp);
    console.log("ICE Candidates are being exchanged to establish the best communication path.");
    console.groupEnd();
    console.log("Enjoy your call!");
};


// 4. Hang up
hangupButton.onclick = async () => {
  console.log("Hanging up the call...");
  // Close the peer connection
  peerConnection.close();
  peerConnection = new RTCPeerConnection(servers);

  // Stop all local and remote media tracks
  localStream.getTracks().forEach((track) => {
    console.log(`Stopping local ${track.kind} track:`, track);
    track.stop();
  });
  remoteStream.getTracks().forEach((track) => {
    console.log(`Stopping remote ${track.kind} track:`, track);
    track.stop();
  });

  // Reset the video elements
  webcamVideo.srcObject = null;
  remoteVideo.srcObject = null;

  console.log("Resetting the interface...");
  // Reset the buttons
  callButton.disabled = true;
  answerButton.disabled = true;
  hangupButton.disabled = true;
  webcamButton.disabled = false;

  // Optionally, delete the call document from Firestore
  const callId = callInput.value;
  if (callId) {
      const callDoc = doc(collection(firestore, 'calls'), callId);
      try {
          console.log("Deleting call document/record from Firestore...");
          await deleteDoc(callDoc); // Use deleteDoc to delete the Firestore document
          console.log(`Call document/record with ID ${callId} has been deleted from Firestore.`);
      } catch (error) {
        console.error("Error deleting the call record/document:", error);
      }
  }

  // Clear the call input field
  callInput.value = '';
  console.log("The call has ended. You can start a new call or join another one.");
  console.log("Call hung up successfully.");
};