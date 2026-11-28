import { useEffect, useState } from 'react';
import { createDocument } from '../shared/defaults';
import { validateDocument } from '../shared/validate';
import type { ShowDocument } from '../shared/types';

const KEY = 'fold-xh001-v1';
function load(): { document: ShowDocument; notice: string } {
  try {
    const raw = localStorage.getItem(KEY);
    return { document: raw ? validateDocument(JSON.parse(raw)) : createDocument(), notice: '' };
  } catch {
    return { document: createDocument(), notice: '本地演出未能读取，已打开示例。可导入演出文件继续。' };
  }
}
export function useDocument() {
  const [initial] = useState(load);
  const [document, setDocument] = useState(initial.document);
  const [notice, setNotice] = useState(initial.notice);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(document)); }
    catch { setNotice('本地空间不足。请下载演出文件保存本次修改。'); }
  }, [document]);
  return { document, setDocument, notice, setNotice };
}
