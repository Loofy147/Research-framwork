import { logger } from './logger';

/**
 * @interface PerformanceMetrics
 * @description Represents a single performance metric.
 * @property {string} name - The name of the metric (e.g., 'FCP', 'LCP').
 * @property {number} value - The value of the metric.
 * @property {'good' | 'needs-improvement' | 'poor'} rating - The rating based on standard web vitals thresholds.
 */
interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Thresholds for Core Web Vitals to determine the rating.
 * @const
 */
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

/**
 * Calculates the rating for a given metric based on its value.
 * @param {string} metric - The name of the metric.
 * @param {number} value - The value of the metric.
 * @returns {'good' | 'needs-improvement' | 'poor'} The performance rating.
 */
function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'good'; // Default to 'good' if no threshold is defined
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * @class PerformanceMonitor
 * @description A singleton class to monitor and report web performance metrics, including Core Web Vitals.
 */
export class PerformanceMonitor {
  /**
   * The singleton instance of the PerformanceMonitor.
   * @private
   * @static
   * @type {PerformanceMonitor}
   */
  private static instance: PerformanceMonitor;
  /**
   * A map to store the collected performance metrics.
   * @private
   * @type {Map<string, PerformanceMetrics>}
   */
  private metrics: Map<string, PerformanceMetrics> = new Map();

  /**
   * The private constructor to prevent direct instantiation. Initializes the monitoring.
   * @private
   */
  private constructor() {
    this.initWebVitals();
    this.initResourceTiming();
  }

  /**
   * Gets the singleton instance of the PerformanceMonitor.
   * @returns {PerformanceMonitor} The singleton PerformanceMonitor instance.
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initializes the PerformanceObserver to collect Core Web Vitals.
   * @private
   */
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

  /**
   * Initializes resource timing to calculate Time to First Byte (TTFB).
   * @private
   */
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

  /**
   * Records a metric from a PerformanceEntry object.
   * @private
   * @param {string} name - The name of the performance entry.
   * @param {PerformanceEntry} entry - The performance entry object.
   */
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

  /**
   * Adds a performance metric to the collection.
   * @param {string} name - The name of the metric.
   * @param {number} value - The value of the metric.
   */
  addMetric(name: string, value: number): void {
    const rating = getRating(name, value);
    const metric: PerformanceMetrics = { name, value, rating };
    this.metrics.set(name, metric);
    logger.info(`Performance: ${name}`, { value: value.toFixed(2), rating });
  }

  /**
   * Creates a performance mark.
   * @param {string} name - The name of the mark.
   */
  mark(name: string): void {
    if (!window.performance) return;
    performance.mark(name);
  }

  /**
   * Creates a performance measure between two marks or from a mark to now.
   * @param {string} name - The name of the measure.
   * @param {string} startMark - The name of the starting mark.
   * @param {string} [endMark] - The name of the ending mark. If not provided, measures to now.
   * @returns {number} The duration of the measure in milliseconds.
   */
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

  /**
   * Retrieves all collected performance metrics.
   * @returns {PerformanceMetrics[]} An array of all collected metrics.
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clears all collected metrics, marks, and measures.
   */
  clearMetrics(): void {
    this.metrics.clear();
    if (window.performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

/**
 * The singleton instance of the PerformanceMonitor.
 * @type {PerformanceMonitor}
 */
export const performanceMonitor = PerformanceMonitor.getInstance();
