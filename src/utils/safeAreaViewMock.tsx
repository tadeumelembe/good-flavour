/* global jest */
import React, { useContext } from 'react';
import { ViewProps } from 'react-native';

export interface Metrics {
    insets: EdgeInsets;
    frame: Rect;
  }
  export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface EdgeInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  export interface SafeAreaProviderProps extends ViewProps {
    children?: React.ReactNode;
    initialMetrics?: Metrics | null;
    /**
     * @deprecated
     */
    initialSafeAreaInsets?: EdgeInsets | null;
  }
  
const MOCK_INITIAL_METRICS: Metrics = {
  frame: {
    width: 320,
    height: 640,
    x: 0,
    y: 0,
  },
  insets: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
};

const RNSafeAreaContext = jest.requireActual('react-native-safe-area-context');

export default {
  ...RNSafeAreaContext,
  initialWindowMetrics: MOCK_INITIAL_METRICS,
  useSafeAreaInsets: () => {
    return (
      useContext(RNSafeAreaContext.SafeAreaInsetsContext) ??
      MOCK_INITIAL_METRICS.insets
    );
  },
  useSafeAreaFrame: () => {
    return (
      useContext(RNSafeAreaContext.SafeAreaFrameContext) ??
      MOCK_INITIAL_METRICS.frame
    );
  },
  // Provide a simpler implementation with default values.
  SafeAreaProvider: ({ children, initialMetrics }: SafeAreaProviderProps) => {
    return (
      <RNSafeAreaContext.SafeAreaFrameContext.Provider
        value={initialMetrics?.frame ?? MOCK_INITIAL_METRICS.frame}
      >
        <RNSafeAreaContext.SafeAreaInsetsContext.Provider
          value={initialMetrics?.insets ?? MOCK_INITIAL_METRICS.insets}
        >
          {children}
        </RNSafeAreaContext.SafeAreaInsetsContext.Provider>
      </RNSafeAreaContext.SafeAreaFrameContext.Provider>
    );
  },
};