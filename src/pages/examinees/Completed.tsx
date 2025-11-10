import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const CompletedPage: React.FC = () => {
    return (
        <Container maxWidth="md" className="min-h-screen flex flex-col items-center justify-center ">
            <Box sx={{ mt: 10, mb: 6, display: 'flex', justifyContent: 'center' }}>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h1" component="h1" gutterBottom color="green">
                        Thank You!
                    </Typography>
                    <Typography variant="h2" gutterBottom>
                        Your exam has been successfully submitted.
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ mb: 4 }}>
                        You may now close this window
                    </Typography>
                    <button className="px-6 py-2 rounded-lg bg-red-600 dark:bg-red-500 text-[32px] text-white dark:text-white disabled:opacity-50 font-bold" onClick={() => window.location.href = '/'}>
                            Exit
                    </button>
                </Paper>
            </Box>
        </Container>
    );
};

export default CompletedPage;