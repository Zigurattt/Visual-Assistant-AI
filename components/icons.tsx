import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm0 12a5.001 5.001 0 0 1-5-5H5a7 7 0 0 0 6 6.93V21h2v-2.07A7 7 0 0 0 19 9h-2a5 5 0 0 1-5 5Z" />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}>
    <path d="M7 7h10v10H7V7Z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}>
    <path d="M12 2a1 1 0 0 1 .993.883L13 3v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 .993.883L13 18v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1ZM8.93 4.93a1 1 0 0 1 1.414 0l2.122 2.121a1 1 0 0 1-1.415 1.415L8.93 6.345a1 1 0 0 1 0-1.414Zm8.12 8.12a1 1 0 0 1 1.415 0l2.121 2.122a1 1 0 0 1-1.414 1.414l-2.122-2.121a1 1 0 0 1 0-1.415ZM4.93 8.93a1 1 0 0 1 0 1.414l-2.121 2.122a1 1 0 0 1-1.414-1.415L3.515 8.93a1 1 0 0 1 1.414 0Zm14.14 0a1 1 0 0 1 0 1.414l-2.12 2.121a1 1 0 0 1-1.415-1.414l2.12-2.121a1 1 0 0 1 1.415 0ZM2 12a1 1 0 0 1 .883.993L3 13h3a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Zm15 0a1 1 0 0 1 .883.993L18 13h3a1 1 0 0 1 0 2h-3a1 1 0 0 1-1-1Z" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1ZM19.07 4.93a1 1 0 0 1 .707.293l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414.997.997 0 0 1 .707-.293ZM4.93 19.07a1 1 0 0 1 .707.293l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414.997.997 0 0 1 .707-.293ZM22 12a1 1 0 0 1-1 1h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1ZM4 12a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1ZM19.07 19.07a1 1 0 0 1 .707-.293.997.997 0 0 1 .707.293l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 .707-1.707ZM4.93 4.93a1 1 0 0 1 .707-.293.997.997 0 0 1 .707.293l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707A1 1 0 0 1 4.93 4.93Zm7.07 2.07a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"/>
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M11.453 2.218a1 1 0 0 0-.853.493l-5.132 8.89a1 1 0 0 0 .853 1.507h10.264a1 1 0 0 0 .853-1.507l-5.132-8.89a1 1 0 0 0-.853-.493Z"/>
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M12 1a1 1 0 0 1 1 1v2.07a8 8 0 0 1 5.51 2.3l1.46-1.46a1 1 0 0 1 1.41 1.41l-1.46 1.46A8 8 0 0 1 20.93 11H23a1 1 0 0 1 0 2h-2.07a8 8 0 0 1-2.3 5.51l1.46 1.46a1 1 0 0 1-1.41 1.41l-1.46-1.46A8 8 0 0 1 13 20.93V23a1 1 0 0 1-2 0v-2.07a8 8 0 0 1-5.51-2.3l-1.46 1.46a1 1 0 0 1-1.41-1.41l1.46-1.46A8 8 0 0 1 3.07 13H1a1 1 0 0 1 0-2h2.07a8 8 0 0 1 2.3-5.51l-1.46-1.46a1 1 0 1 1 1.41-1.41l1.46 1.46A8 8 0 0 1 11 3.07V1a1 1 0 0 1 1-1Zm0 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M12 10.586 6.343 4.93 4.93 6.343 10.586 12l-5.657 5.657 1.414 1.414L12 13.414l5.657 5.657 1.414-1.414L13.414 12l5.657-5.657-1.414-1.414L12 10.586Z" />
    </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.66-11.283-8.591l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.447-2.274 4.488-4.384 5.965l6.19 5.238C42.022 35.798 44 30.291 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1-1H5a1 1 0 0 1-1-1v-3Zm2-7h7v2H6v3l-5-4 5-4v3Z"/>
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M3 20.5V13l8-1-8-1V3.5l18 8-18 9Z" />
    </svg>
);

export const BookmarkIcon: React.FC<{ className?: string, solid?: boolean }> = ({ className, solid }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        {solid ? (
            <path d="M5 2h14a1 1 0 0 1 1 1v18l-8-5.333L4 21V3a1 1 0 0 1 1-1Z" />
        ) : (
            <path d="M5 2h14a1 1 0 0 1 1 1v18l-8-5.333L4 21V3a1 1 0 0 1 1-1Zm2 2v13.5l6-4 6 4V4H7Z" />
        )}
    </svg>
);

export const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M3 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Zm2-2v4h14V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1ZM3 11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11Zm10 4H9v-2h4v2Z" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7h-1v13H7V7ZM9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V4Zm-2 3h12V5H7v2Z" />
    </svg>
);

export const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path d="M4 4h2l2.12 8.466a1 1 0 0 0 .963.734H18a1 1 0 0 0 .984-.822L20.82 5.5H6.88L6.42 3.5a1 1 0 0 0-.962-.734H4V4Zm2.58 10 1.28 5.12a1 1 0 0 0 .962.68H18a1 1 0 0 0 .963-.734L20.24 14H6.58ZM10 20a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm8 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>
    </svg>
);

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm13-2h3v2h-3v-2Zm-5 0h2v2h-2v-2Zm-3 3h2v2h-2v-2Zm-2 5h3v2h-3v-2Zm-3-2h2v2h-2v-2Zm-2-2h3v2H8v-2Zm-3-3h2v2H5v-2Zm13 5h5v2h-5v-2Zm0-3h5v2h-5v-2Zm0-3h5v2h-5v-2Z"/>
    </svg>
);

export const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6Zm8 7V4.5l5.5 5.5H14ZM8 14h8v2H8v-2Zm0 4h8v2H8v-2Z"/>
    </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M2 3.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Zm2 .5a1 1 0 0 1 1-1h5v16H4a1 1 0 0 1-1-1V4Zm8 0h6a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-6V4Z"/>
    </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path d="M21.582 6.185a2.536 2.536 0 0 0-1.789-1.789C18.254 4 12 4 12 4s-6.254 0-7.793.396a2.536 2.536 0 0 0-1.789 1.789C2 7.723 2 12 2 12s0 4.277.418 5.815a2.536 2.536 0 0 0 1.789 1.789C5.746 20 12 20 12 20s6.254 0 7.793-.396a2.536 2.536 0 0 0 1.789-1.789C22 16.277 22 12 22 12s0-4.277-.418-5.815ZM10 15.464V8.536l5.214 3.464L10 15.464Z"/>
    </svg>
);

export const ThermometerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M13 12.23V5a3 3 0 0 0-6 0v7.23a5.5 5.5 0 1 0 6 0ZM12 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    </svg>
);

export const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path d="M2 6a1 1 0 0 1 .77-.97l6-2A1 1 0 0 1 10 4v12a1 1 0 0 1-.77.97l-6 2A1 1 0 0 1 2 18V6Zm8 13.5L16.5 21l6-2.5V3l-6 2.5L10 3v16.5ZM18 5.76l3 1.25V17.24l-3-1.25V5.76Z"/>
    </svg>
);

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}>
        <path d="M12 2a9.5 9.5 0 0 0-6.49 16.51A7.5 7.5 0 0 1 12 11a7.5 7.5 0 0 1 6.49 8.51A9.5 9.5 0 0 0 12 2ZM8.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM17 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-6.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm10 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-2.5 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
);