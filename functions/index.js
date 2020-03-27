//import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
var functions = require('firebase-functions')
var admin = require('firebase-admin')
admin.initializeApp();



exports.deleteProfile = functions.region('europe-west2').auth.user().onDelete((user) => {
    console.log("somebody deleted their account with id: " + user.uid);
    //testing if user is helper
    admin.firestore().collection('helpers').doc(user.uid).get().then((doc) => {
        //helper
        if (doc.exists) {
            console.log("its a helper");
            admin.firestore().collection('helpers').doc(user.uid).delete().then(() => {
                console.log("deleted helper with id: " + user.uid);
                let acceptedOffers = [];
                admin.firestore().collection('acceptedOffers').where('helperId', '==', user.uid).get().then(snapshot => {
                    snapshot.forEach(s => {
                        acceptedOffers.push(s);
                        console.log("found accepted offer form helperId. accept-offer-id: " + s.id);
                            admin.firestore().collection('acceptedOffers').doc(s.id).delete().then(() => {
                                console.log("Deleted acceptedOffers from helper: " + user.uid);
                                return "du hurensohn";
                            }).catch(error => {
                                console.log("error helper delete from acceptedoffer: " + error);
                            });
                    });
                    return "lul";
                }).catch(error => {
                    console.log("error with getting acceptedOffers: " + error);
                });

                
                return "lul";
            }).catch(error => {
                console.log("error deleting helper error: " + error);
            });
        }
        //not helper --> probably agrarian
        else {
            console.log("its a farmer");
            admin.firestore().collection('agrarians').doc(user.uid).delete().then(() => {
                console.log("Farmer successfully deleted: " + user.uid);
                let offersWithId = [];
                admin.firestore().collection('offers').where('agrarianId', '==', user.uid).get().then(snapshot => {
                    snapshot.forEach(s => {
                        offersWithId.push(s);
                        console.log("found offer from agrarian: " + s.id);
                        admin.firestore().collection('offers').doc(s.id).delete().then(() => {
                        console.log("Deleted offers from agrarian: " + user.uid);
                        return "du hurensohn";
                    }).catch(error => {
                        console.log("error agrarian delete from offer: " + error);
                    });
                    })
                    return "lul";
                }).catch(error => {
                    console.log("error with getting offers from agrarian: " + error);
                });
                return "lul";
            }).catch(error => {
                console.log("error deleting user: " + error);
            })
        }

        return "du hurensohn";
    }).catch(error => {
        console.log("error getting onDelete user:" + error);
    })
    return true;
});

//onDelete --> decrement helperCount
exports.decrementHelperCounter = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onDelete((acceptedOffer) => {
    admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
        console.log("updating offer");
        let helperCount = offer.data().helperCount;
        let data = {
            helperCount: helperCount - 1,
        }

        offer.ref.update(data).then(() => {
            console.log("updated helperCount to: " + (helperCount - 1).toString());
            return "blub";
        }).catch(error => {
            console.log("error updating helperCount: " + error);
        });
        return "hi";
    }).catch(error => {
        console.log("error counting down offer-helpers after deletion: " + error);
    })
    return true;
});

//onCreate --> increment helpercount
exports.incrementHelperCounter = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onCreate((acceptedOffer) => {
    admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
        console.log("updating offer");
        let helperCount = offer.data().helperCount;
        let data = {
            helperCount: helperCount + 1,
        }
        offer.ref.update(data).then(() => {
            console.log("updated helperCount to: " + (helperCount + 1).toString());
            return "blub";
        }).catch(error => {
            console.log("error updating helperCount: " + error);
        });
        return "hey";
    }).catch(error => {
        console.log("error counting up offer-helpers after creation: " + error);
    })
    return true;
});