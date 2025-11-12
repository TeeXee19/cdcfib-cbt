import { Modal, Box, Typography, Button } from "@mui/material";

interface modalProps {
  children: JSX.Element;
  open: boolean;
  setOpen: (status: boolean) => void;
  title: string;
  width?: number;
}

const ModalPopup = ({ children, setOpen, open, title, width = 400 }: modalProps) => {
  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: width }, // 90% on mobile, fixed on sm+
    maxWidth: "600px", // prevent excessive width
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: { xs: 2, sm: 4 }, // smaller padding on mobile
    maxHeight: "90vh", // so it fits on small screens
    overflowY: "auto", // scroll inside if content is too long
  };

  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>

        <Box id="modal-description" sx={{ mt: 2 }}>
          {children}
        </Box>

        <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalPopup;
