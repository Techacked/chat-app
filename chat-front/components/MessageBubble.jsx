'use client'

export default function MessageBubble({ message, isOwn, showAvatar }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
      {/* Avatar for other user */}
      {!isOwn && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar ? (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {message.sender?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}
        </div>
      )}

      {/* Message bubble */}
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-dark-sidebar text-dark-text rounded-bl-md'
          }`}
        >
          {/* Sender name for group chats or when needed */}
          {!isOwn && showAvatar && (
            <div className="text-xs text-gray-300 mb-1 font-medium">
              {message.sender?.username || 'Unknown'}
            </div>
          )}
          
          {/* Message content */}
          <div className="break-words">
            {message.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>

      {/* Spacer for own messages */}
      {isOwn && <div className="w-8 h-8 flex-shrink-0"></div>}
    </div>
  )
}