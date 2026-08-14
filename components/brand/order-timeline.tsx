import type { StatusEvent } from '@/lib/api';
import { STATUS_LABELS } from '@/lib/orders';
import { formatDateTime } from '@/lib/utils';
import { HeartMark } from './heart-mark';

export function OrderTimeline({ history }: { history: StatusEvent[] }) {
  if (!history?.length) return null;

  return (
    <ol className="mt-3 space-y-0">
      {history.map((ev, i) => {
        const isLast = i === history.length - 1;
        const isCancelled = ev.status === 'cancelled';
        return (
          <li key={ev.id} className="flex gap-3">
            {/* Riel + hito. El hito actual lleva el corazón de marca; los ya
                cumplidos, un punto sobrio que no compite con él. */}
            <div className="flex flex-col items-center">
              {isLast && !isCancelled ? (
                <HeartMark className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" />
              ) : (
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
                    isCancelled
                      ? 'border-destructive bg-destructive'
                      : 'border-brand-blush bg-brand-blush'
                  }`}
                />
              )}
              {!isLast && <span className="w-px flex-1 bg-brand-blush/70" />}
            </div>
            {/* Contenido */}
            <div className={`pb-4 ${isLast ? '' : ''}`}>
              <p
                className={`text-sm font-semibold ${
                  isCancelled
                    ? 'text-destructive'
                    : isLast
                      ? 'text-brand-chocolate'
                      : 'text-brand-chocolate/80'
                }`}
              >
                {STATUS_LABELS[ev.status]}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(ev.createdAt)}
              </p>
              {ev.note && (
                <p className="mt-0.5 text-xs italic text-muted-foreground">
                  {ev.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
