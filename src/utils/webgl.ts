export const checkWebGL = () => {
    if (typeof window === 'undefined') return false;

    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
            canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });

        if (!gl) return false;

        // Strict blocking for known incompatible hardware (User's specific crash)
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer && (/Intel.*HD Graphics.*Direct3D9Ex/i.test(renderer) || /Direct3D9Ex/i.test(renderer))) {
                return false;
            }
        }

        const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();

        return true;
    } catch (e) {
        return false;
    }
};

// Singleton to avoid re-running heavy check
let isSupported: boolean | null = null;
export const getWebGLSupport = () => {
    if (isSupported === null) {
        isSupported = checkWebGL();
    }
    return isSupported;
};
