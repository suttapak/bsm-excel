import {} from "react-hot-toast";
/**
 *     promise<T>(promise: Promise<T> | (() => Promise<T>), msgs: {
        loading: Renderable;
        success?: ValueOrFunction<Renderable, T>;
        error?: ValueOrFunction<Renderable, any>;
    }
 */
export const toastMessage = {
  loading: "กำลังโหลดข้อมูล...",
  success: "ดำเนินการสำเร็จ",
  error: "เกิดข้อผิดพลาดในการดำเนินการ",
};
