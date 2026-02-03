export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    usertype: string;
    image: string;
}

export interface Userpersonaldata {
    id: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
    bodytype: string;
    documentimage: string;
    medicalissues: string;
    foodcategory: string;
    usergoal: string;
    user_id: string;
}