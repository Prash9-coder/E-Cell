import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoCarousel from '../VideoCarousel'

const mockVideos = [
  {
    id: 1,
    title: "Test Video 1",
    speaker: "Test Speaker 1",
    description: "Test description 1",
    url: "https://youtu.be/G79641HhbP8"
  },
  {
    id: 2,
    title: "Test Video 2",
    speaker: "Test Speaker 2",
    description: "Test description 2",
    url: "https://www.youtube.com/watch?v=W5_2J82bNH4"
  },
  {
    id: 3,
    title: "Test Video 3",
    speaker: "Test Speaker 3",
    description: "Test description 3",
    url: "https://www.youtube.com/watch?v=lYKFVk_8LhY"
  }
]

describe('VideoCarousel', () => {
  test('renders video carousel with correct titles', () => {
    render(<VideoCarousel videos={mockVideos} />)
    
    expect(screen.getByText('Test Video 1')).toBeInTheDocument()
    expect(screen.getByText('Test Video 2')).toBeInTheDocument()
    expect(screen.getByText('Test Video 3')).toBeInTheDocument()
  })

  test('renders video speakers', () => {
    render(<VideoCarousel videos={mockVideos} />)
    
    expect(screen.getByText('Test Speaker 1')).toBeInTheDocument()
    expect(screen.getByText('Test Speaker 2')).toBeInTheDocument()
    expect(screen.getByText('Test Speaker 3')).toBeInTheDocument()
  })

  test('shows video thumbnail by default', () => {
    render(<VideoCarousel videos={mockVideos} />)
    
    const thumbnails = screen.getAllByRole('img')
    expect(thumbnails).toHaveLength(3)
  })

  test('shows embedded video when thumbnail is clicked', () => {
    render(<VideoCarousel videos={mockVideos} />)
    
    const firstThumbnail = screen.getAllByRole('img')[0].parentElement
    fireEvent.click(firstThumbnail)
    
    const iframe = screen.getByTitle('Test Video 1')
    expect(iframe).toBeInTheDocument()
    expect(iframe.src).toContain('youtube.com/embed')
  })
})