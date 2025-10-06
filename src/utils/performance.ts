import { logger } from './logger';

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  private constructor() {
    this.initWebVitals();
    this.initResourceTiming();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initWebVitals(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry as PerformanceEntry);
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      logger.error('Failed to initialize Web Vitals', error);
    }
  }

  private initResourceTiming(): void {
    if (!window.performance) return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.addMetric('TTFB', ttfb);
      }
    });
  }

  private recordMetric(name: string, entry: PerformanceEntry): void {
    let metricName = name;
    let value = 0;

    if (entry.entryType === 'paint') {
      metricName = entry.name === 'first-contentful-paint' ? 'FCP' : entry.name;
      value = entry.startTime;
    } else if (entry.entryType === 'largest-contentful-paint') {
      metricName = 'LCP';
      value = entry.startTime;
    } else if (entry.entryType === 'first-input') {
      metricName = 'FID';
      value = (entry as PerformanceEventTiming).processingStart - entry.startTime;
    } else if (entry.entryType === 'layout-shift') {
      metricName = 'CLS';
      value = (entry as any).value;
    }

    this.addMetric(metricName, value);
  }

  addMetric(name: string, value: number): void {
    const rating = getRating(name, value);
    const metric: PerformanceMetrics = { name, value, rating };
    this.metrics.set(name, metric);
    logger.info(`Performance: ${name}`, { value: value.toFixed(2), rating });
  }

  mark(name: string): void {
    if (!window.performance) return;
    performance.mark(name);
  }

  measure(name: string, startMark: string, endMark?: string): number {
    if (!window.performance) return 0;

    try {
      const measure = endMark
        ? performance.measure(name, startMark, endMark)
        : performance.measure(name, startMark);

      const duration = measure.duration;
      logger.debug(`Measure: ${name}`, { duration: duration.toFixed(2) });
      return duration;
    } catch (error) {
      logger.error('Failed to measure performance', error);
      return 0;
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
    if (window.performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
