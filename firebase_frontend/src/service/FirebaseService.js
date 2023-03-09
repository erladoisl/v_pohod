import { initializeApp } from "firebase/app";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    orderBy,
    where,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { is_admin, auth } from "./FBUsersService";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const get_hike_owner_uid = async(object, collection_name) => {
    if (collection_name === 'hikes') {
        return object.user_id
    }

    if (collection_name === 'hike_days') {
        const hike = await getDoc(doc(db, 'hikes', object.hike_id))
        return hike.data().user_id
    }
    if (collection_name === 'eatings') {
        const hike_day = await getDoc(doc(db, 'hike_days', object.hike_day_id))
        const hike = await getDoc(doc(db, 'hikes', hike_day.data().hike_id))

        return hike.data().user_id
    }

    if (collection_name === 'ingredients') {
        const eating = await getDoc(doc(db, 'eatings', object.eating_id))
        const hike_day = await getDoc(doc(db, 'hike_days', eating.data().hike_day_id))
        const hike = await getDoc(doc(db, 'hikes', hike_day.data().hike_id))

        return hike.data().user_id
    }
}

const has_permissions = async(object, collection_name) => {
    // true - if user has permissions
    // else - false

    // for new objects: 
    if (typeof(object.id) !== 'string' && ['food', 'formula', 'hikes'].indexOf(collection_name) != -1) {
        return true
    }

    // if user is admin
    const admin = await is_admin()

    if (admin) { return true }

    // can edit only admin
    if (collection_name === 'eating_category') {
        return false
    }

    // for hike owner:
    const hike_owner_uid = await get_hike_owner_uid(object, collection_name)

    return hike_owner_uid === auth.currentUser.uid
}

const updateIngredientAmount = async(ingredient) => {
    let amount = -1

    if (ingredient.formula_id && ingredient.food_id) {
        try {
            const formula = await getDoc(doc(db, 'formula', ingredient.formula_id))

            const eating = await getDoc(doc(db, 'eatings', ingredient.eating_id))
            const hike_day = await getDoc(doc(db, 'hike_days', eating.data().hike_day_id))
            const hike = await getDoc(doc(db, 'hikes', hike_day.data().hike_id))
            const hike_days = (await get_objects_by_field('hike_id', hike_day.data().hike_id, 'hike_days'))
            const food = await getDoc(doc(db, 'food', ingredient.food_id))

            const DAYS_COUNT = hike_days.error ? 0 : hike_days.objects.length
            const AMOUNT_PER_PERSON = food.data().amount_per_person
            const PARTICIPANT_COUNT = hike.data().participant_count

            amount = eval(formula.data().value)
        } catch (e) {
            console.error(`Error while updating amount ${ingredient}: `, e);
        }
        let updatedIngredient = {...ingredient, amount: amount }

        const result = await edit_object(updatedIngredient, 'ingredients')

        return {...result, ingredient: updatedIngredient }
    } else if (ingredient.food_id) {
        return { error: false, message: 'Для вычисления количества необходимо выбрать формулу рассчета' }
    } else if (ingredient.formula_id) {
        return { error: false, message: 'Для вычисления количества необходимо выбрать продукт' }
    }
}

const edit_object = async(object, collection_name) => {
    try {
        const perm = await has_permissions(object, collection_name)

        if (!perm) {
            return { 'error': true, 'message': 'Нет прав редактировать объект' }
        }


        let objectRef = {};

        if (object.id && object.id !== -1) {
            const object_doc = doc(db, collection_name, object.id);
            objectRef = await updateDoc(object_doc, object);
        } else {
            objectRef = await addDoc(collection(db, collection_name), {...object, user_id: auth.currentUser.uid });
        }
        const object_id = object.id === -1 ? objectRef.id : object.id;

        return { error: false, message: "Сохранено", id: object_id };
    } catch (e) {
        console.error(`Error adding ${collection_name}: `, e);

        return {
            error: true,
            message: `Ошибка при добавлении ${object}`,
            id: object.id,
        };
    }
};

const delete_object = async(object, collection_name) => {
    try {
        const perm = await has_permissions(object, collection_name)

        if (!perm) {
            return { 'error': true, 'message': 'Нет прав удалять объект' }
        }
        await deleteDoc(doc(db, collection_name, object.id));

        return { error: false, message: "Успешно удалено" };
    } catch (e) {
        console.error(`Error deleting object ${collection_name}`, e);

        return {
            error: true,
            message: `Ошибка при удалении ${collection_name}`,
        };
    }
};

const delete_objects_by_field_deprecated = async(
    collection_name,
    field_name,
    field_value
) => {
    try {
        const q = query(
            collection(db, collection_name),
            where(field_name, "==", field_value)
        );

        await getDocs(q).then((querySnapshot) => {
            querySnapshot.docs.forEach((object) => {
                deleteDoc(doc(db, collection_name, object.id));
            });
        });
        return {
            error: false,
            message: `Успешно удален объект ${collection_name}`,
        };
    } catch (e) {
        console.error(
            `Error deleting ${collection_name} by ${field_name} === ${field_value}`,
            e
        );

        return { error: true, message: "Ошибка при удалении продукта" };
    }
};


const get_objects = async(collection_name) => {
    let objects = [];
    try {
        const q = query(
            collection(db, collection_name))
        await getDocs(q).then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                objects.push({...doc.data(), id: doc.id });
            });
        });
        return { objects: objects, error: false };

    } catch (err) {
        return { error: false, message: err.message }
    }
};

const get_objects_by_field = async(
    field_name,
    field_value,
    object_collection_name,
    ordered_field_name = "",
    ordered = false
) => {
    let objects = [];
    let q = null;
    const user = auth.currentUser;

    try {
        if (user !== null) {
            if (ordered) {
                q = query(
                    collection(db, object_collection_name),
                    orderBy(ordered_field_name),
                    where(field_name, "==", field_value)
                );
            } else {
                q = query(
                    collection(db, object_collection_name),
                    where(field_name, "==", field_value)
                );
            }
            await getDocs(q).then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    objects.push({...doc.data(), id: doc.id });
                });
            });
        }
        return { objects: objects, error: false };

    } catch (err) {
        return { error: false, message: err.message }
    }
};

const get_object = async(collection_name, id) => {
    const object = await getDoc(doc(db, collection_name, id))
    return object.data()

}
export {
    edit_object,
    delete_object,
    delete_objects_by_field_deprecated as delete_objects_by_field,
    get_objects_by_field,
    get_objects,
    get_object,
    updateIngredientAmount,
};