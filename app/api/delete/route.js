import { admin } from "../firebase-admin";  // استيراد الكائن admin من firebase-admin

export async function POST(req) {
    const { userId } = await req.json();  // استخراج userId من الطلب

    // التأكد من وجود userId
    if (!userId) {
        return new Response(
            JSON.stringify({ message: "يجب توفير userId لحذف المستخدم." }),
            { status: 400 }
        );
    }

    try {
        // 1. حذف المستخدم من Firebase Authentication
        await admin.auth().deleteUser(userId);

        // 2. حذف بيانات المستخدم من Firebase Realtime Database
        const userRef = admin.database().ref(`users/${userId}`);
        await userRef.remove();

        console.log("User deleted successfully");

        // الرد بالنجاح
        return new Response(
            JSON.stringify({ message: "تم حذف المستخدم بنجاح" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(
            JSON.stringify({ message: "حدث خطأ أثناء حذف المستخدم", error: error.message }),
            { status: 500 }
        );
    }
}
