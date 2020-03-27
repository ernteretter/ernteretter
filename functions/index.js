//import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
var functions = require('firebase-functions')
var admin = require('firebase-admin')
admin.initializeApp();



exports.deleteProfile = functions.region('europe-west2').auth.user().onDelete((user) => {
    console.log("somebody deleted their account");
    //testing if user is helper
    admin.firestore().collection('helper').doc(user.uid).get().then((doc) => {
        //helper
        if (doc.exists) {
            console.log("its a helper");
            admin.firestore().collection('helper').doc().delete().then(() => {
                console.log("deleted helper with id: " + user.uid);
                let acceptedOffers = [];
                admin.firestore().collection('acceptedOffers').where('helperId', '==', user.uid).get().then(snapshot => {
                    snapshot.forEach(s => {
                        acceptedOffers.push(s);
                        console.log("found accepted offer form helperId. accept-offer-id: " + s.id);
                    });
                    console.log("found acceptedoffer from helper");
                    return "lul";
                }).catch(error => {
                    console.log("error with getting acceptedOffers: " + error);
                });

                for (const offer in acceptedOffers) {
                    admin.firestore().collection('acceptedOffers').doc(offer.id).delete().then(() => {
                        console.log("Deleted acceptedOffers from helper: " + user.uid);
                        return "du hurensohn";
                    }).catch(error => {
                        console.log("error helper delete from acceptedoffer: " + error);
                    });
                }
                return "lul";
            }).catch(error => {
                console.log("error deleting helper error: " + error);
            });
        }
        //not helper --> probably agrarian
        else {
            console.log("its a farmer");
            admin.firestore().collection('agrarian').doc().delete().then(() => {
                console.log("User successfully deleted: " + user.uid);
                let offersWithId = [];
                admin.firestore().collection('offers').where('agrarianId', '==', user.uid).get().then(snapshot => {
                    snapshot.forEach(s => {
                        offersWithId.push(s);
                        console.log("found offer from agrarian: " + s.id);
                    })
                    return "lul";
                }).catch(error => {
                    console.log("error with getting offers from agrarian: " + error);
                });

                for (const offer in offersWithId) {
                    admin.firestore().collection('offers').doc(offer.id).delete().then(() => {
                        console.log("Deleted offers from agrarian: " + user.uid);
                        return "du hurensohn";
                    }).catch(error => {
                        console.log("error agrarian delete from offer: " + error);
                    });
                }
                return "lul";
            }).catch(error => {
                console.log("error deleting user: " + error);
            })
        }

        return "du hurensohn";
    }).catch(error => {
        console.log("error getting onDelete user:" + error);
    })
});

//onDelete --> decrement helperCount
// exports.decrementHelperCounter = functions.region('europe-west2').firestore().collection('acceptedOffers').onDelete((acceptedOffer) => {
//     admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
//         offer.helperCount = offer.helperCount - 1;
//         return "hi";
//     }).catch(error => {
//         console.log("error counting down offer-helpers after deletion: " + error);
//     })
// }).catch(error => {
//     console.log("error onDelete: " + error);
// });

// //onCreate --> increment helpercount
// exports.incrementHelperCounter = functions.region('europe-west2').firestore().collection('acceptedOffers').onCreate((acceptedOffer) => {
//     admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
//         offer.helperCount = offer.helperCount + 1;
//         return "hey";
//     }).catch(error => {
//         console.log("error counting up offer-helpers after creation: " + error);
//     })
// }).catch(error => {
//     console.log("error onCreate: " + error);
// });