// import React from "react";
// import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
// import "./MainPage.css"; // Import CSS for styling

// const MainPage: React.FC = () => {
//   return (
//     <IonPage>
//       {/* Header with Signup and Login */}
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Student Sphere</IonTitle>
//           <div className="auth-buttons">
//             <IonButton fill="clear">Sign In</IonButton>
//             <IonButton fill="solid" color="primary">Register</IonButton>
//           </div>
//         </IonToolbar>
//       </IonHeader>

//       {/* Main Content */}

//     </IonPage>
//   );
// };

// export default MainPage;


// import React from 'react';
// import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
// import "./MainPage.css";

// const MainPage: React.FC = () => {
//     return (
//         <IonPage>
//             <IonHeader>
//                 <IonToolbar className="header-toolbar">
//                     <IonTitle>Student Connect</IonTitle>
//                     <IonButtons slot="end">
//                         <IonButton fill="outline" className="auth-button">Log In</IonButton>
//                         <IonButton fill="solid" color="primary" className="auth-button">Sign Up</IonButton>
//                     </IonButtons>
//                 </IonToolbar>
//             </IonHeader>
//             <IonContent className="ion-padding">
//                 <div className="main-container">
//                     <h1 className="main-heading">Find Friends, Roommates & Accommodation</h1>
//                     <p className="main-description">Connect with students based on your preferences. Right swipe to chat, save favorites, and explore housing options.</p>

//                     <IonImg src="assests/student.jpg" alt="Students connecting" className="main-image" />

//                     <IonCard className="register-card">
//                         <IonCardHeader>
//                             <IonCardTitle>Join the Community</IonCardTitle>
//                         </IonCardHeader>
//                         <IonCardContent>
//                             <IonButton expand="full" className="google-button">
//                                 <img src="assests/image.png" alt="Google" className="google-icon" />
//                                 Register with Google
//                             </IonButton>
//                             <IonButton expand="full" fill="outline" className="email-button">
//                                 Register with Email
//                             </IonButton>
//                         </IonCardContent>
//                     </IonCard>
//                 </div>
//             </IonContent>
//         </IonPage>
//     );
// };

// export default MainPage;

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import "./MainPage.css";

const MainPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="header-toolbar">
                    <IonTitle>Student Connect</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill="outline" className="auth-button">Log In</IonButton>
                        <IonButton fill="solid" color="primary" className="auth-button">Sign Up</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="main-layout">
                    <div className="text-section">
                        <h1 className="main-heading">Find Friends, Roommates & Accommodation</h1>
                        <p className="main-description">Connect with students based on your preferences. Right swipe to chat, save favorites, and explore housing options.</p>

                        <IonCard className="register-card">
                            <IonCardHeader>
                                <IonCardTitle>Join the Community</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonButton expand="full" className="google-button">
                                    <img src="assets/image.png" alt="Google" className="google-icon" />
                                    Register with Google
                                </IonButton>
                                <IonButton expand="full" fill="outline" className="email-button">
                                    Register with Email
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                    </div>
                    <div className="image-section">
                        <IonImg src="assets/student.jpg" alt="Students connecting" className="main-image" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MainPage;