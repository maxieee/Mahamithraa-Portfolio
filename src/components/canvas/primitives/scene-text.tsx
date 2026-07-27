'use client';

import { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import type { ComponentProps } from 'react';
import { FONT_3D_BODY, FONT_3D_DISPLAY } from '@/lib/fonts';

type TextProps = ComponentProps<typeof Text>;

interface SceneTextProps extends Omit<TextProps, 'font'> {
  variant?: 'display' | 'body';
}

/**
 * drei <Text> pinned to the self-hosted font.
 *
 * All 3D type is decorative — the readable, indexable copy for every scene
 * lives in the DOM overlay — so these nodes are marked aria-hidden by virtue of
 * living inside the canvas, which is itself hidden from assistive tech.
 */
export const SceneText = forwardRef<
  React.ComponentRef<typeof Text>,
  SceneTextProps
>(function SceneText({ variant = 'body', children, ...props }, ref) {
  return (
    <Text
      ref={ref}
      font={variant === 'display' ? FONT_3D_DISPLAY : FONT_3D_BODY}
      anchorX="center"
      anchorY="middle"
      {...props}
    >
      {children}
    </Text>
  );
});
