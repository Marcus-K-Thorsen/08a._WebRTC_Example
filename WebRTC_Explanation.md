# Introduction to WebRTC

## 📘 Glossary

| Term                    | Full Name / Description                                                                 |
|-------------------------|------------------------------------------------------------------------------------------|
| *WebRTC*                | **Web Real-Time Communication** — A technology built into modern browsers that enables real-time communication of audio, video, and data directly between devices. It eliminates the need for plugins or external software, making it ideal for applications like video conferencing, file sharing, and live streaming. |
| *Peer-to-peer*          | A direct connection between two devices (peers) that allows them to communicate without relying on a central server. This approach reduces latency and improves privacy by keeping data between the two devices. |
| *Browser*               | The software application used to access the internet (e.g., Chrome, Firefox, Safari). In the context of WebRTC, browsers act as endpoints that establish and manage peer-to-peer connections. |
| *Server*                | A computer or system that provides data, resources, or services to other devices (clients). In WebRTC, servers are typically used during the signaling phase to exchange connection setup information but are not involved in the actual data transfer. |
| *Media capture*         | The process of accessing and using a device's camera and microphone to capture video and audio streams. WebRTC uses the browser's `getUserMedia` API to request access to these devices. |
| *Signaling*             | The exchange of metadata and connection information (e.g., session descriptions, ICE candidates) between peers to establish a WebRTC connection. This process is typically facilitated by a signaling server. |
| *Connection setup*      | The process of negotiating and establishing a communication channel between two peers. This involves exchanging information about codecs, network paths, and other connection parameters. |
| *STUN server*           | **Session Traversal Utilities for NAT** — A server that helps a device discover its public IP address and port when behind a NAT (Network Address Translation). This is essential for enabling direct peer-to-peer connections. |
| *TURN server*           | **Traversal Using Relays around NAT** — A server that relays data between peers when a direct connection cannot be established due to restrictive NATs or firewalls. TURN servers act as intermediaries to ensure communication. |
| *Latency*               | The delay between sending and receiving data. In WebRTC, minimizing latency is crucial for real-time applications like video calls and live streaming to ensure a smooth user experience. |
| *ICE candidate*         | **Interactive Connectivity Establishment** — A potential network path (IP address and port) that a browser can use to connect to another peer. Multiple ICE candidates are gathered and tested to find the best path for communication. |
| *SDP*                   | **Session Description Protocol** — A format used to describe multimedia communication sessions. In WebRTC, SDP is used to exchange information about codecs, media types, and connection details between peers during the signaling process. |

---

## 🌐 What is WebRTC?

**WebRTC** * is a set of technologies built into most modern *browsers* * that allows people to share **live video, voice, and data** directly between devices — without needing to install anything or go through a central *server* *.

It powers things like video chats, screen sharing, and real-time file transfer — all within your browser.

---

### 📦 Real-Life Analogy: The Post Office vs. Direct Delivery

Imagine you want to send a letter or a video message to a friend:

#### Traditional Internet Communication (Using a Server)
You write your letter and take it to the **Post Office**.  
The post office delivers it to your friend.

> This is how most internet services work — your messages, video, and voice are sent through a *server* *, like Zoom or Skype. The server handles the job of delivering everything.

#### WebRTC (Peer-to-Peer Communication)
You walk straight to your friend’s house and hand them the letter yourself.

> That’s what WebRTC does. It lets your *browser* * connect directly to your friend’s browser. There’s no "post office" (no central server) in the middle.

---

### 🔁 Connecting the Analogy to Real Concepts

| In the Analogy           | Real Concept                        |
|--------------------------|-------------------------------------|
| You                     | Your browser                        |
| Your friend             | The other person’s browser          |
| Walking to their house  | A direct *peer-to-peer* * connection |
| Post Office             | A traditional server                |
| The letter              | The video, audio, or data being sent |

---

## ⚖️ Benefits and Disadvantages of WebRTC

WebRTC offers several advantages for real-time communication, but it also has some limitations. Here's a breakdown of its benefits and disadvantages, compared to traditional server-based communication methods:

### ✅ Benefits of WebRTC

1. **Lower Latency**  
   WebRTC establishes a direct peer-to-peer connection, minimizing the delay between sending and receiving data.  
   **Comparison**: Traditional server-based methods (e.g., Zoom or Skype) often route data through a central server, which can introduce additional latency.

2. **Improved Privacy**  
   Since data is exchanged directly between peers, sensitive information does not pass through a central server.  
   **Comparison**: Server-based communication methods store or process data on their servers, which can be a privacy concern.

3. **No Installation Required**  
   WebRTC is built into modern browsers, so users don’t need to download or install additional software or plugins.  
   **Comparison**: Many alternatives, like desktop applications (e.g., Microsoft Teams), require installation and updates.

4. **Built-In Support for Multiple Media Types**  
   WebRTC natively supports video, audio, screen sharing, and data transfer, making it versatile for various use cases.  
   **Comparison**: Alternatives often require separate tools or APIs for different types of communication (e.g., FTP for file sharing, separate APIs for video).

5. **Cost Efficiency**  
   By reducing reliance on central servers for data transfer, WebRTC can lower infrastructure costs for developers.  
   **Comparison**: Server-based solutions require significant investment in server infrastructure and maintenance.

---

### ❌ Disadvantages of WebRTC

1. **Network Restrictions**  
   WebRTC struggles with restrictive NATs (Network Address Translations) or firewalls, which can block direct peer-to-peer connections.  
   **Comparison**: Server-based methods are less affected by these restrictions since they rely on centralized servers to relay data.

2. **Scalability Challenges**  
   WebRTC is ideal for one-to-one or small group communications, but scaling to large groups (e.g., webinars) requires additional infrastructure like SFUs (Selective Forwarding Units).  
   **Comparison**: Server-based solutions are better suited for large-scale communication, as they can handle multiple connections through centralized servers.

3. **Browser Compatibility**  
   While WebRTC is supported by most modern browsers, older browsers or certain devices may not fully support it.  
   **Comparison**: Dedicated applications often provide a more consistent experience across all devices.

4. **Quality of Service (QoS)**  
   WebRTC relies on the quality of the peer-to-peer connection, which can vary based on network conditions.  
   **Comparison**: Server-based methods can optimize and stabilize connections by routing traffic through high-performance servers.

5. **Security Concerns**  
   While WebRTC uses encryption (e.g., DTLS and SRTP), improper implementation can lead to vulnerabilities.  
   **Comparison**: Server-based solutions often have more robust security measures in place, such as centralized monitoring and advanced firewalls.

---

### 🆚 Summary: WebRTC vs. Traditional Server-Based Communication

| Feature                  | WebRTC                              | Traditional Server-Based Communication |
|--------------------------|-------------------------------------|----------------------------------------|
| **Latency**              | Low (direct peer-to-peer)          | Higher (data routed through servers)  |
| **Privacy**              | High (data stays between peers)    | Lower (data passes through servers)   |
| **Ease of Use**          | No installation required           | Often requires app installation       |
| **Scalability**          | Limited to small groups            | Better suited for large groups        |
| **Network Restrictions** | Affected by NAT/firewall issues    | Less affected                         |
| **Security**             | Relies on proper implementation    | Centralized security measures         |

WebRTC is a powerful tool for real-time communication, especially for one-to-one or small group interactions. However, for large-scale or highly secure applications, traditional server-based methods may still be the better choice.

---

## 🔧 How does WebRTC work?

This section explains the general WebRTC connection flow and highlights how it applies to this project. While WebRTC is versatile and can exchange various types of data (e.g., text, files, or media streams), this project focuses on real-time video and audio communication. Below is a step-by-step breakdown of the process:

---

### 1. Media Capture (Specific to This Project)

Before any WebRTC connection can be established, the browser must capture the media streams (video and audio) from the user's device. This is done using the browser's `getUserMedia` API, which requests access to the camera and microphone.

- **What happens here?**  
  The browser prompts the user for permission to access their camera and microphone. If the user grants permission, the browser captures the media streams and makes them available as `MediaStream` objects.

- **Why is this important?**  
  In this project, the captured media streams are used as the "local stream" that will be sent to the other peer during the WebRTC connection. However, WebRTC itself is not responsible for requesting permission or capturing media; this is handled by the browser.

- **Relevant Code:**  
  See `main.js`, lines 43–81.  
  Look for the `NOTE: Media Capture` comment.

---

### 2. Signaling (General WebRTC Concept)

Signaling is the process of exchanging metadata and connection information between peers to establish a WebRTC connection. This includes exchanging:

- **Session Description Protocol (SDP):**  
  Describes the media capabilities (e.g., codecs, resolution) and connection details of each peer.
  
- **ICE Candidates:**  
  Interactive Connectivity Establishment (ICE) candidates represent potential network paths (IP addresses and ports) that peers can use to connect.

- **What happens here?**  
  In this project, signaling is implemented using Firebase Firestore as a signaling server. The caller creates an "offer" (SDP) and shares it with the receiver through Firestore. The receiver responds with an "answer" (SDP). Both peers also exchange ICE candidates to determine the best network path for communication.

- **Why is this important?**  
  WebRTC does not define how signaling should be implemented, so developers must use an external mechanism (e.g., WebSocket, Firebase, or HTTP) to handle this step.

- **Relevant Code:**  
  - Caller creates an offer: See `main.js`, lines 86–164.  
    Look for the `NOTE: Signaling - Caller` comment.  
  - Receiver answers the call: See `main.js`, lines 169–233.  
    Look for the `NOTE: Signaling - Receiver` comment.

---

### 3. Connection Setup (General WebRTC Concept)

Once signaling is complete, the peers use the exchanged information to establish a direct connection. This involves:

- **STUN Servers:**  
  Used to discover the public IP address and port of a peer behind a NAT (Network Address Translation). This is necessary for enabling direct communication.

- **TURN Servers:**  
  If a direct connection cannot be established (e.g., due to restrictive firewalls), a TURN server relays the data between peers.

- **What happens here?**  
  The WebRTC API gathers ICE candidates and tests them to find the best path for communication. If a direct connection is possible, the peers connect directly. Otherwise, they fall back to using a TURN server.

- **Why is this important?**  
  This step ensures that the peers can communicate regardless of their network configurations.

- **Relevant Code:**  
  See `main.js`, lines 8–15.  
  Look for the `NOTE: Connection Setup` comment.

---

### 4. Peer-to-Peer Connection (General WebRTC Concept)

Once the connection is established, the peers can exchange data directly without involving a central server. In this project, the data being exchanged is the video and audio streams.

- **What happens here?**  
  - The local media tracks (video and audio) are added to the peer connection using `addTrack()`.  
  - The remote peer receives these tracks and adds them to its media stream.  
  - The `ontrack` event is triggered whenever a new track is received, allowing the remote peer to display the video and audio.

- **Why is this important?**  
  This is the core functionality of WebRTC, enabling real-time communication with low latency.

- **Relevant Code:**  
  - Adding local tracks: See `main.js`, lines 55–58.  
    Look for the `NOTE: Peer-to-Peer - Local Tracks` comment.  
  - Handling remote tracks: See `main.js`, lines 62–68.  
    Look for the `NOTE: Peer-to-Peer - Remote Tracks` comment.

---

### Summary: WebRTC in General vs. This Project

| Step                  | General WebRTC Concept                          | Specific to This Project                                   |
|-----------------------|------------------------------------------------|----------------------------------------------------------|
| **Media Capture**     | Not part of WebRTC; handled by the browser.    | Uses `getUserMedia` to capture video and audio streams.  |
| **Signaling**         | Exchanging SDP and ICE candidates.             | Implemented using Firebase Firestore.                   |
| **Connection Setup**  | Uses STUN/TURN servers to establish a path.    | Configured with Google's public STUN servers.           |
| **Peer-to-Peer Data** | Direct exchange of any type of data.           | Exchanges video and audio streams between peers.         |

This project demonstrates how WebRTC can be used for real-time video and audio communication, but the same principles can be applied to other use cases, such as file sharing or text-based chat.

