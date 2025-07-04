import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa'
import { getVideoInfo } from '../../utils/videoHelpers'

const VideoCarousel = ({ videos }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(videos.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(videos.length / 3)) % Math.ceil(videos.length / 3))
  }



  const toggleVideo = (index) => {
    setActiveVideo(activeVideo === index ? null : index)
  }

  const visibleVideos = videos.slice(currentSlide * 3, (currentSlide + 1) * 3)

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
        disabled={videos.length <= 3}
      >
        <FaChevronLeft className="text-gray-600" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
        disabled={videos.length <= 3}
      >
        <FaChevronRight className="text-gray-600" />
      </button>

      {/* Video Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {visibleVideos.map((video, index) => {
          const globalIndex = currentSlide * 3 + index
          const isActive = activeVideo === globalIndex
          const videoInfo = getVideoInfo(video.url)
          const { embedUrl, thumbnailUrl } = videoInfo

          return (
            <div key={globalIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                {isActive && embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                ) : (
                  <div className="relative w-full h-full cursor-pointer group" onClick={() => toggleVideo(globalIndex)}>
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors">
                        <FaPlay className="text-white text-xl ml-1" />
                      </div>
                    </div>
                    {/* Fallback background */}
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white" style={{ display: 'none' }}>
                      <div className="text-center">
                        <FaPlay className="text-4xl mb-2 mx-auto" />
                        <p className="text-sm">Video Thumbnail</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{video.speaker}</p>
                <p className="text-gray-500 text-sm line-clamp-3">{video.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Slide indicators */}
      {videos.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(videos.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoCarousel