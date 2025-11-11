import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';

interface CompletedPageProps {
    score: number;
    totalMarks?: number;
}

const CompletedPage: React.FC<CompletedPageProps> = ({
    score,
    totalMarks = 100,
}) => {

    return (
        <Container className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 text-white shadow-md">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <span className="font-semibold text-lg">CBT Exam Result </span>
                    </div>
                </div>
            </nav>

            <Box sx={{ mt: 12, mb: 6, display: 'flex', justifyContent: 'center' }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
                        borderRadius: 4,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        maxWidth: 700,
                        width: '100%',
                    }}
                >
                    <Typography variant="h2" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        Exam Submitted
                    </Typography>



                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h3" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        Score
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            color: '#2e7d32',
                            fontWeight: 'bold',
                            backgroundColor: '#e8f5e9',
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '2rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        {score}/{totalMarks}
                    </Typography>
                    {/* <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
                        Thank you for completing the exam. You can now exit the portal.
                    </Typography> */}
                    <br />

                    <button
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white text-xl font-semibold shadow-md"
                        onClick={() => window.location.href = '/'}
                    >
                        Exit
                    </button>
                </Paper>
            </Box>
        </Container>
    );
};

export default CompletedPage;