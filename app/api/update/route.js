import { admin } from "../firebase-admin"; // تأكد من المسار الصحيح

export async function POST(req) {
    // استخراج البيانات من الطلب
    const { userId, newName, newEmail, newPassword, newRole, newSemiRole } = await req.json();

    // إذا لم يتم توفير userId، إعادة استجابة بالخطأ
    if (!userId) {
        console.log("لم يتم توفير userId لتعديل البيانات.");
        return new Response(
            JSON.stringify({ message: "يجب توفير userId لتعديل البيانات." }),
            { status: 400 }
        );
    }

    try {
        console.log("البدء في تحديث البيانات للمستخدم:", userId);

        const auth = admin.auth();
        const updates = {};

        // تحديث البيانات بناءً على المدخلات
        if (newName) {
            console.log("تحديث الاسم إلى:", newName);
            updates.displayName = newName;
        }
        if (newEmail) {
            console.log("تحديث البريد الإلكتروني إلى:", newEmail);
            updates.email = newEmail;
        }
        if (newPassword) {
            console.log("تحديث كلمة المرور.");
            updates.password = newPassword;
        }

        // تحديث البيانات في Firebase Authentication
        console.log("تحديث بيانات المستخدم في Firebase Authentication.");
        await auth.updateUser(userId, updates);

        // تحديث البيانات في Firebase Realtime Database
        const userRef = admin.database().ref(`users/${userId}`);
        console.log("تحديث بيانات المستخدم في Firebase Realtime Database.");
        await userRef.update({
            username: newName || null,
            email: newEmail || null,
            role: newRole || null,
            semi_role: newSemiRole || null,
        });

        console.log("تم تحديث البيانات بنجاح.");

        // إرجاع رسالة النجاح
        return new Response(
            JSON.stringify({ message: "تم تحديث بيانات المستخدم بنجاح" }),
            { status: 200 }
        );
    } catch (error) {
        // طباعة تفاصيل الخطأ
        console.error("حدث خطأ أثناء تعديل بيانات المستخدم:", error);

        // إرجاع رسالة الخطأ في حال حدوث مشكلة
        return new Response(
            JSON.stringify({ message: "حدث خطأ أثناء تعديل بيانات المستخدم", error: error.message }),
            { status: 500 }
        );
    }
}
