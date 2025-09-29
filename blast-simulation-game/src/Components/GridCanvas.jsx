import React, { useRef, useEffect, useCallback } from 'react';
import OreBlock from './OreBlock';

/**
 * Canvas component that handles the rendering of the ore grid
 */
const GridCanvas = ({ 
  gridData, 
  canvasSize, 
  blockSize, 
  onBlockClick,
  className = ""
}) => {
  const canvasRef = useRef(null);
  const blocksRef = useRef([]);

  // Create OreBlock instances for each cell in the grid
  const createBlocks = useCallback(() => {
    if (!gridData) return [];

    const blocks = [];
    const { grid } = gridData;
    const options = {
      emptyColor: '#ffffff'
    };

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        const block = new OreBlock(cell, x, y, blockSize, options);
        blocks.push(block);
      });
    });

    return blocks;
  }, [gridData, blockSize]);

  // Update blocks when dependencies change
  useEffect(() => {
    blocksRef.current = createBlocks();
  }, [createBlocks]);

  // Render all blocks on the canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gridData) return;

    const ctx = canvas.getContext('2d');

    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all blocks
    blocksRef.current.forEach(block => {
      block.render(ctx);
    });

    console.log(`Canvas rendered: ${blocksRef.current.length} blocks`);
  }, [gridData]);

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle canvas click events
  const handleCanvasClick = useCallback((event) => {
    if (!gridData || !onBlockClick) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    // Find the clicked block
    const clickedBlock = blocksRef.current.find(block => 
      block.containsPoint(pixelX, pixelY)
    );

    if (clickedBlock) {
      const blockInfo = clickedBlock.getBlockInfo();
      onBlockClick(blockInfo);
      // ❌ REMOVED: console.log('Block clicked:', blockInfo);
    }
  }, [gridData, onBlockClick]);

  if (!gridData) {
    return (
      <div className="flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50" 
           style={{ width: canvasSize.width, height: canvasSize.height }}>
        <p className="text-gray-500">No grid data available</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden inline-block">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className={`cursor-crosshair ${className}`}
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default GridCanvas;