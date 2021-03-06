import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS 
  // --------

  createAccount = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () => this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());
  
  signInWithFacebook = () => this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () => this.auth.signInWithPopup(new app.auth.GithubAuthProvider());
  
  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => this.db.collection('users').doc(id).set(user);

  getUser = id => this.db.collection('users').doc(id).get();

  passwordUpdate = password => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword).then(() => {
        const user = this.auth.currentUser;
        user.updatePassword(newPassword).then(() => {
          resolve('Password updated successfully!');
        }).catch(error =>  reject(error));
      }).catch(error =>  reject(error));
    });
  }

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(user.email, currentPassword);

    return user.reauthenticateWithCredential(cred);
  }

  updateEmail = (currentPassword, newEmail) => {
    return new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword).then(() => {
        const user = this.auth.currentUser;
        user.updateEmail(newEmail).then((data) => {
          resolve('Email Successfully updated');
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  updateProfile = (id, updates) => this.db.collection('users').doc(id).update(updates);

  onAuthStateChanged = () => {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          return resolve(user);
        } else {
          return reject(new Error('Auth State Changed failed'));
        }
      });
    });
  }

  setAuthPersistence = () => this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
 
  // // PRODUCT ACTIONS
  // // ---------

  getProducts = (lastRefKey) => {
      let didTimeout = false;

      return new Promise(async (resolve, reject) => {
        if (lastRefKey) {
          try {
            const query = this.db.collection('products').orderBy(app.firestore.FieldPath.documentId()).startAfter(lastRefKey).limit(12);
            const snapshot = await query.get();
            const products = [];
            snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];
            
            resolve({ products, lastKey });
          } catch (e) {
            reject(':( Failed to fetch products.');
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject('Request timeout, please try again');
          }, 15000); 

          try {
            // getting the total count of data

            // adding shallow parameter for smaller response size
            // better than making a query from firebase
            // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);
            
            const totalQuery = await this.db.collection('products').get();
            const total = totalQuery.docs.length;
            const query = this.db.collection('products').orderBy(app.firestore.FieldPath.documentId()).limit(12);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products = [];
              snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
              const lastKey = snapshot.docs[snapshot.docs.length - 1];
              
              resolve({ products, lastKey, total});
            }
          } catch (e) {
            if (didTimeout) return;
            console.log('Failed to fetch products: An error occured while trying to fetch products or there may be no product ', e);
            reject(':( Failed to fetch products.');
          }
        }
      });
  }
    

  getCategories = (lastRefKey) => {

    let didTimeout = false;

      return new Promise(async (resolve, reject) => {
        if (lastRefKey) {
          try {
            const query = this.db.collection('categories').orderBy(app.firestore.FieldPath.documentId()).startAfter(lastRefKey);
            const snapshot = await query.get();
            const categories = [];
            snapshot.forEach(doc => categories.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];
            
            resolve({ categories, lastKey });
          } catch (e) {
            reject(':( Failed to fetch categories.');
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject('Request timeout, please try again');
          }, 15000); 

          try {
            // getting the total count of data

            // adding shallow parameter for smaller response size
            // better than making a query from firebase
            // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);
            
            const totalQuery = await this.db.collection('categories').get();
            const total = totalQuery.docs.length;
            const query = this.db.collection('categories').orderBy(app.firestore.FieldPath.documentId());
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const categories = [];
              snapshot.forEach(doc => categories.push({ id: doc.id, ...doc.data() }));
              const lastKey = snapshot.docs[snapshot.docs.length - 1];
              
              resolve({ categories, lastKey, total});
            }
          } catch (e) {
            if (didTimeout) return;
            console.log('Failed to fetch categories: An error occured while trying to fetch categories or there may be no category ', e);
            reject(':( Failed to fetch categories.');
          }
        }
      });
  };

  addProduct = (id, product) => this.db.collection('products').doc(id).set(product);

  addCategory = (id, category) => this.db.collection('categories').doc(id).set(category);

  generateKey = (name) => this.db.collection(name).doc().id;

  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  }

  deleteImage = (id, folder) => this.storage.ref(folder).child(id).delete();

  editProduct = (id, updates) => this.db.collection('products').doc(id).update(updates);

  removeProduct = id => this.db.collection('products').doc(id).delete();

  editCategory = (id, updates) => this.db.collection('categories').doc(id).update(updates);

  removeCategory = id => this.db.collection('categories').doc(id).delete();
}

const firebase = new Firebase();

export default firebase;
