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
// exports.decrementHelperCounter = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onDelete((acceptedOffer) => {
//     admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
//         console.log("updating offer");
//         let helperCount = offer.data().helperCount;
//         let data = {
//             helperCount: helperCount - 1,
//         }

//         offer.ref.update(data).then(() => {
//             console.log("updated helperCount to: " + (helperCount - 1).toString());
//             return "blub";
//         }).catch(error => {
//             console.log("error updating helperCount: " + error);
//         });
//         return "hi";
//     }).catch(error => {
//         console.log("error counting down offer-helpers after deletion: " + error);
//     })
//     return true;
// });

// //onCreate --> increment helpercount
// exports.incrementHelperCounter = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onCreate((acceptedOffer) => {
//     admin.firestore().collection('offers').doc(acceptedOffer.data().offerId).get().then((offer) => {
//         console.log("updating offer");
//         let helperCount = offer.data().helperCount;
//         let data = {
//             helperCount: helperCount + 1,
//         }
//         offer.ref.update(data).then(() => {
//             console.log("updated helperCount to: " + (helperCount + 1).toString());
//             return "blub";
//         }).catch(error => {
//             console.log("error updating helperCount: " + error);
//         });
//         return "hey";
//     }).catch(error => {
//         console.log("error counting up offer-helpers after creation: " + error);
//     })
//     return true;
// });


exports.countHelpers = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onWrite((acceptedOffer) => {
    if (acceptedOffer.before.data() !== undefined && acceptedOffer.after.data() === undefined) {
        admin.firestore().collection('offers').doc(acceptedOffer.before.data().offerId).get().then((offer) => {
            console.log("removing one helper from helpercount");
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
            return "hey";
        }).catch(error => {
            console.log("error counting up offer-helpers after creation: " + error);
        })
    }
    else if(acceptedOffer.before.data() === undefined && acceptedOffer.after.data() !== undefined) {
        admin.firestore().collection('offers').doc(acceptedOffer.after.data().offerId).get().then((offer) => {
        console.log("adding one helper to helpercount");
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
        return "hi";
    }).catch(error => {
        console.log("error counting down offer-helpers after deletion: " + error);
    })
    }
    return true;
});

exports.notifyOnAcceptedOffer = functions.region('europe-west2').firestore.document('acceptedOffers/{acceptedOfferId}').onWrite(async (acceptedOffer) => {
    var helper
    var agrarian
    var offer
    //erstellt
    if(acceptedOffer.after.exists){
        console.log("ich existiere");
        console.log(acceptedOffer.after.data().helperId)
        helper = await admin.auth().getUser(acceptedOffer.after.data().helperId).then((user) => {
            return user
        })
        agrarian = await admin.auth().getUser(acceptedOffer.after.data().helperId).then(async (user) => {
            offer = await admin.firestore().collection("offers").doc(acceptedOffer.after.data().offerId).get().then((offer) => {
                return offer.data()
            })
            return await admin.auth().getUser(offer.agrarianId).then((user) => {
                return user
            })
        })
        admin.firestore().collection('mail').add({
            to: helper.email,
            from: 'ernteretter <noreply@ernte-retter.de>',
            template: {
                name: 'acceptedOfferHelper',
                data : {
                    name: helper.displayName,
                    offerTitle: offer.title,
                }
            },
          }).catch(err => {
              console.log("error notifying helper" + err);
              
          })
          admin.firestore().collection('mail').add({
            to: agrarian.email,
            from: 'ernteretter <noreply@ernte-retter.de>',
            template: {
            name: 'acceptedOfferAgrarian',
            data : {
                    name: agrarian.displayName,
                    helperName: helper.displayName,
                    offerTitle: offer.title,
                }
            },
          }).catch(err => {
              console.log("error notifying helper" + err);
              
          })
    } else {
        //gelöscht
        console.log("ich existiere nicht mehr ");
        console.log(acceptedOffer.before.data().helperId)
        helper = await admin.auth().getUser(acceptedOffer.before.data().helperId).then((user) => {
            return user
        })
        agrarian = await admin.auth().getUser(acceptedOffer.before.data().helperId).then(async (user) => {
            offer = await admin.firestore().collection("offers").doc(acceptedOffer.before.data().offerId).get().then((offer) => {
                return offer.data()
            })
            return await admin.auth().getUser(offer.agrarianId).then((user) => {
                return user
            })
        })
        admin.firestore().collection('mail').add({
            to: helper.email,
            from: 'ernteretter <noreply@ernte-retter.de>',
            template: {
                name: 'acceptedOfferHelperRemoved',
                data : {
                    name: helper.displayName,
                    offerTitle: offer.title,
                }
            },
          }).catch(err => {
              console.log("error notifying helper" + err);
              
          })
          admin.firestore().collection('mail').add({
            to: agrarian.email,
            from: 'ernteretter <noreply@ernte-retter.de>',
            template: {
                name: 'acceptedOfferAgrarianRemoved',
                data : {
                    name: agrarian.displayName,
                    helperName: helper.displayName,
                    offerTitle: offer.title,
                }
            },
          }).catch(err => {
              console.log("error notifying helper" + err);
              
          })
    }
      
      return true
    
})

exports.notifyAtChatMessage = functions.region('europe-west2').firestore.document('chats/{chatId}/messages/{messageId}').onWrite(async (message, context) => {
    var author = message.after.data().author
    var chatpartner = context.resource
    chatpartner = chatpartner.name.slice(60,117).replace(author, "").replace("_", "")
    chatpartner = await admin.auth().getUser(chatpartner).then((user) => {
        return user
    })
    author = await admin.auth().getUser(author).then((user) => {
        return user
    })
    admin.firestore().collection('mail').add({
        to: chatpartner.email,
            from: 'ernteretter <noreply@ernte-retter.de>',
            template: {
                name: 'chatMail',
                data : {
                    name: chatpartner.displayName,
                    chatparnterName: author.displayName,
                    message: message.after.data().text
                }
            },
    })
})