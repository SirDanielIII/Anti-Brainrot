// AttentionModal.jsx
import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AttentionModal = ({ isOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Looking Away Modal"
      style={{
        // overlay: full-screen background behind the modal content
        overlay: {
          zIndex: 9998, // Keep this on top of everything
          backgroundColor: "rgba(0, 0, 0, 0.5)", // a semi-transparent overlay if you like
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <h2>Attention!</h2>
      <p>You've been looking away for more than 10 seconds. Please focus!</p>
      <button
        onClick={closeModal}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        I'm back
      </button>
    </Modal>
  );
};

export default AttentionModal;
