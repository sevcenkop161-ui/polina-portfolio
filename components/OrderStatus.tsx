"use client";

import { useSyncExternalStore } from "react";
import { orderMonth } from "@/lib/orderMonth";

// дата не «подписывается» на изменения — пересчитываем при каждом рендере
const subscribe = () => () => {};

// Сайт статический: HTML собирается один раз при сборке.
// initial — месяц на момент сборки (его передаёт сервер): с ним страница «оживает» без расхождений,
// а сразу после этого React подставляет месяц по сегодняшней дате посетителя.
export default function OrderStatus({ prefix, initial }: { prefix: string; initial: string }) {
  const month = useSyncExternalStore(subscribe, () => orderMonth(), () => initial);
  return <span>{`${prefix} ${month}`}</span>;
}
