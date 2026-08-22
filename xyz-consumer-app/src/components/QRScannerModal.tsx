import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, Sparkles, Upload, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (qrCode: string) => void;
  onScanError?: (msg: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setInvalidMsg(null);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    startCamera();

    return () => {
      stopCamera();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setInvalidMsg(null);
    setScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        await videoRef.current.play();
        setHasCamera(true);
        requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCamera(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. You can still test using instant demo QR buttons below.'
          : 'Could not access device camera. Try the instant test codes below.'
      );
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const tick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleDetectedQR(code.data);
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const handleDetectedQR = (data: string) => {
    stopCamera();
    onScanSuccess(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDetectedQR(code.data);
          } else {
            setInvalidMsg('No valid QR code found in this image');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Scan Shop QR Code</h3>
              <p className="text-[11px] text-neutral-500">Point at any xyz.com retailer QR</p>
            </div>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="relative bg-neutral-950 flex items-center justify-center min-h-[260px] overflow-hidden">
          {hasCamera ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-red-500 rounded-2xl relative">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                  {/* Laser scan line animation */}
                  <div className="w-full h-0.5 bg-red-500/80 shadow-[0_0_8px_#ef4444] animate-pulse absolute top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-white flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-3 text-red-400">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-300 font-medium mb-1">
                {cameraError || 'Camera preview not accessible in preview frame'}
              </p>
              <p className="text-[11px] text-neutral-400 mb-3">
                Use the instant test QR codes below to test shop discovery instantly.
              </p>
              {hasCamera === false && (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-neutral-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Camera Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Warning */}
        {invalidMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{invalidMsg}</span>
          </div>
        )}

        {/* Quick Instant Test QR Codes */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex-1 overflow-y-auto">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Sparkles className="w-3 h-3 text-red-600" /> Instant Test QR Codes:
          </div>

          <div className="space-y-1.5">
            <button
              id="test-qr-sun123"
              onClick={() => handleDetectedQR('SUN123')}
              className="w-full text-left p-2.5 bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-300 rounded-xl transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover:text-red-700">
                  Sun Chicken & Meat Center
                </div>
                <div className="text-[10px] text-neutral-500">ID: SUN123 • Fresh chicken cuts</div>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                Scan Demo
              </span>
            </button>

            <button
              id="test-qr-royal456"
              onClick={() => handleDetectedQR('ROYAL456')}
              className="w-full text-left p-2.5 bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-300 rounded-xl transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover:text-red-700">
                  Royal Fresh Poultry & Cuts
                </div>
                <div className="text-[10px] text-neutral-500">ID: ROYAL456 • Farm fresh cuts</div>
              </div>
              <span className="text-[10px] bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-full group-hover:bg-red-100 group-hover:text-red-700">
                Scan Demo
              </span>
            </button>
          </div>

          {/* Upload QR Image file fallback */}
          <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-neutral-600 hover:text-red-600">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
