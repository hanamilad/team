import { admin } from "../firebase-admin"; // تأكد من المسار الصحيح

export async function POST(req) {
    const { userId, newName, newEmail, newPassword, newRole, newSemiRole } = await req.json();

    if (!userId) {
        return new Response(
            JSON.stringify({ message: "يجب توفير userId لتعديل البيانات." }),
            { status: 400 }
        );
    }

    try {
        const auth = admin.auth();
        const updates = {};

        // تحديث البيانات بناءً على المدخلات
        if (newName) updates.displayName = newName;
        if (newEmail) updates.email = newEmail;
        if (newPassword) updates.password = newPassword;

        // تحديث البيانات في Firebase Authentication
        await auth.updateUser(userId, updates);

        // تحديث البيانات في Firebase Realtime Database
        const userRef = admin.database().ref(`users/${userId}`);
        await userRef.update({
            username: newName || null,
            email: newEmail || null,
            role: newRole || null,
            semi_role: newSemiRole || null,
        });

        // إرجاع رسالة النجاح
        return new Response(
            JSON.stringify({ message: "تم تحديث بيانات المستخدم بنجاح" }),
            { status: 200 }
        );
    } catch (error) {
        // إرجاع رسالة الخطأ في حال حدوث مشكلة
        return new Response(
            JSON.stringify({ message: "حدث خطأ أثناء تعديل بيانات المستخدم", error: error.message }),
            { status: 500 }
        );
    }
}
