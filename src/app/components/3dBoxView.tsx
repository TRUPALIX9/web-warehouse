"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Box, Typography } from "@mui/material";

interface Props {
  length: number;
  width: number;
  height: number;
}

function DynamicCamera({ length, width, height }: Props) {
  const { camera } = useThree();

  useEffect(() => {
    const maxDim = Math.max(length, width, height);
    camera.position.set(maxDim * 1.5, maxDim * 1.5, maxDim * 2);
    camera.lookAt(0, 0, 0);
  }, [length, width, height, camera]);

  return null;
}

// Helper to get simplified ratio
function simplifyRatio(a: number, b: number, c: number): string {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const d = gcd(gcd(a, b), c);
  return `${a / d}:${b / d}:${c / d}`;
}

export default function ItemBoxPreview({ length, width, height }: Props) {
  const ratio =
    length && width && height
      ? simplifyRatio(Math.round(length), Math.round(width), Math.round(height))
      : "N/A";

  return (
    <Box
      sx={{
        border: "2px solid #ddd",
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box sx={{ height: 240 }}>
        <Canvas shadows camera={{ position: [10, 10, 10] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <OrbitControls
            enablePan={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
          <DynamicCamera length={length} width={width} height={height} />

          {/* Always visible grid */}
          <Grid
            position={[0, 0, 0]}
            args={[100, 100]}
            cellSize={1}
            cellThickness={1}
            sectionSize={10}
            sectionThickness={2}
            cellColor="white"
            sectionColor="#444"
            fadeDistance={50}
            fadeStrength={0.5}
            infiniteGrid={true}
          />

          {/* Box on Grid */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[length || 1, height || 1, width || 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </Canvas>
      </Box>

      <Box sx={{ p: 1, bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
        <Typography variant="body2" fontWeight={500}>
          Ratio (L : W : H): {ratio}
        </Typography>
      </Box>
    </Box>
  );
}
