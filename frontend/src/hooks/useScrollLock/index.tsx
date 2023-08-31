import { useEffect, useCallback } from "react";

export const useScrollLock = () => {
  /**
   * イベントリスナーの設定
   */
  useEffect(() => {
    // モバイルスクロール禁止処理
    document.addEventListener("touchmove", scrollNo, { passive: false });

    return () => {
      // イベントの設定解除
      document.removeEventListener("touchmove", scrollNo);
    };
  }, []);

  /**
   * モバイルスクロール禁止処理
   */
  const scrollNo = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);
};
