declare module 'roughjs' {
    export default class RoughCanvas {
      constructor(canvas: HTMLCanvasElement, options?: RoughCanvasOptions);
      draw(drawable: Drawable): void;
    }
  
    export interface RoughCanvasOptions {
      roughness?: number;
      bowing?: number;
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
      fillStyle?: string;
      fillWeight?: number;
      hachureAngle?: number;
      hachureGap?: number;
      curveTightness?: number;
      simplification?: number;
    }
  
    export type Drawable = RoughAnnotation | RoughDrawable;
  
    export interface RoughAnnotation {
      type: 'path' | 'fillPath' | 'text';
      strokeWidth?: number;
      roughness?: number;
      bowing?: number;
      stroke?: string;
      fill?: string;
      fillStyle?: string;
      fillWeight?: number;
      hachureAngle?: number;
      hachureGap?: number;
      font?: string;
      fontSize?: number;
      fontFamily?: string;
      textAlign?: 'left' | 'center' | 'right';
      verticalAlign?: 'top' | 'middle' | 'bottom';
      content?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    }
  
    export interface RoughDrawable {
      sets: OpSet[];
      options: DrawableOptions;
    }
  
    export interface OpSet {
      op: 'move' | 'bcurveTo' | 'lineTo' | 'qcurveTo' | 'arc' | 'curveTo' | 'close';
      data: number[];
    }
  
    export interface DrawableOptions {
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      fillWeight?: number;
      hachureAngle?: number;
      hachureGap?: number;
      roughness?: number;
      bowing?: number;
      curveTightness?: number;
      dashGap?: number;
      dashOffset?: number;
      simplifyThreshold?: number;
      fillStyle?: 'hachure' | 'solid';
      roughness2?: number;
      strokeSharpness?: 'butt' | 'sharp' | 'round';
      strokeLineJoin?: 'miter' | 'bevel' | 'round';
    }
  }
  