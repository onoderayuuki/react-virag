import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

interface Motif {
  readonly height: number;
  readonly width: number;
  readonly src: string;
  readonly tag: string;
}

interface RootMotif extends Motif {
  authorRef?: FirebaseFirestore.DocumentReference;
}

export const onUsersMotifCreate = functions.firestore.document('/users/{userId}/motif/{motifId}').onCreate(async (snapshot, context) => {
  await copyToRootWithUsersMotifSnapshot(snapshot, context);
});
export const onUsersMotifUpdate = functions.firestore.document('/users/{userId}/motif/{motifId}').onUpdate(async (change, context) => {
  await copyToRootWithUsersMotifSnapshot(change.after, context);
});
export const onUsersMotifDelete = functions.firestore.document('/users/{userId}/motif/{motifId}').onDelete(async (snapshot, context) => {
  await deleteFromRootWithUsersMotifSnapshot(snapshot, context);
});

async function copyToRootWithUsersMotifSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const motifId = snapshot.id;
  const userId = context.params.userId;
  const motif = snapshot.data() as RootMotif;

  motif.authorRef = firestore.collection('users').doc(userId);
  if(userId=="e6sk0UkXAxNpLeRlJlFpWzZJNMA3"){
    await firestore.collection('motif').doc(motifId).set(motif, { merge: true });
  }
}

async function deleteFromRootWithUsersMotifSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const motifId = snapshot.id;
  const userId = context.params.userId;
  const motif = snapshot.data() as RootMotif;

  motif.authorRef = firestore.collection('users').doc(userId);
  if(userId=="e6sk0UkXAxNpLeRlJlFpWzZJNMA3"){
    console.log("delete",motifId);
    await firestore.collection('motif').doc(motifId).delete();
  }
}


//シリーズ
interface Series {
  readonly title: string;
  readonly tagNames: string[];
}

interface RootSeries extends Series {
  authorRef?: FirebaseFirestore.DocumentReference;
}


export const onUsersSeriesCreate = functions.firestore.document('/users/{userId}/series/{seriesId}').onCreate(async (snapshot, context) => {
  await copyToRootWithUsersSeriesSnapshot(snapshot, context);
});
export const onUsersSeriesUpdate = functions.firestore.document('/users/{userId}/series/{seriesId}').onUpdate(async (change, context) => {
  await copyToRootWithUsersSeriesSnapshot(change.after, context);
});

async function copyToRootWithUsersSeriesSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const seriesId = snapshot.id;
  const userId = context.params.userId;
  const series = snapshot.data() as RootSeries;

  series.authorRef = firestore.collection('users').doc(userId);
  if(userId=="e6sk0UkXAxNpLeRlJlFpWzZJNMA3"){
    await firestore.collection('series').doc(seriesId).set(series, { merge: true });
  }

}

//デザイン
interface motifImage {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly src: string;
}

interface Design {
  readonly backImage: motifImage;
  readonly images: Array<motifImage>;
  readonly base64: string;
  readonly timestamp: Date;
}

interface RootDesign extends Design {
  authorRef?: FirebaseFirestore.DocumentReference;
}


export const onUsersDesignCreate = functions.firestore.document('/users/{userId}/design/{designId}').onCreate(async (snapshot, context) => {
  await copyToRootWithUsersDesignSnapshot(snapshot, context);
});
export const onUsersDesignUpdate = functions.firestore.document('/users/{userId}/design/{designId}').onUpdate(async (change, context) => {
  await copyToRootWithUsersDesignSnapshot(change.after, context);
});

async function copyToRootWithUsersDesignSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const designId = snapshot.id;
  const userId = context.params.userId;
  const design = snapshot.data() as RootDesign;

  design.authorRef = firestore.collection('users').doc(userId);
  if(userId=="e6sk0UkXAxNpLeRlJlFpWzZJNMA3"){
    await firestore.collection('design').doc(designId).set(design, { merge: true });
  }
}