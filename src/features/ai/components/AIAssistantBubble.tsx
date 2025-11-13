import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, PanResponder, Dimensions } from 'react-native';

interface AIAssistantBubbleProps {
  onPress: () => void;
  unreadCount?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_SIZE = 60;

const AIAssistantBubble: React.FC<AIAssistantBubbleProps> = ({ onPress, unreadCount = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Position state - default bottom right
  const pan = useRef(new Animated.ValueXY({ 
    x: SCREEN_WIDTH - BUBBLE_SIZE - 20, 
    y: SCREEN_HEIGHT - BUBBLE_SIZE - 90 
  })).current;
  
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  // Pan responder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        // Scale down when start dragging
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
        
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        setIsDragging(false);
        
        // Scale back to normal
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        
        pan.flattenOffset();
        
        // Get final position
        const finalX = (pan.x as any)._value;
        const finalY = (pan.y as any)._value;
        
        // If gesture was small (< 10px), treat as tap
        if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
          onPress();
          return;
        }
        
        // Snap to edges (left or right)
        const screenCenter = SCREEN_WIDTH / 2;
        const newX = finalX < screenCenter ? 20 : SCREEN_WIDTH - BUBBLE_SIZE - 20;
        
        // Keep within vertical bounds
        let newY = finalY;
        if (newY < 60) newY = 60; // Top boundary (below header)
        if (newY > SCREEN_HEIGHT - BUBBLE_SIZE - 90) {
          newY = SCREEN_HEIGHT - BUBBLE_SIZE - 90; // Bottom boundary (above tab bar)
        }
        
        // Animate to snap position
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      {/* Pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.1],
              outputRange: [0.5, 0],
            }),
          },
        ]}
      />
      
      {/* Main bubble */}
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* AI Icon - Sparkle/Star effect */}
        <Text style={styles.icon}>✨</Text>
        
        {/* Badge for unread suggestions */}
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </Animated.View>
      
      {/* Dragging hint (show only when dragging) */}
      {isDragging && (
        <View style={styles.dragHint}>
          <Text style={styles.dragHintText}>Kéo thả</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    zIndex: 9999,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#34d399', // emerald-400 (nhạt hơn emerald-500 #10b981)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#34d399', // emerald-400
    top: 0,
    left: 0,
  },
  icon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dragHint: {
    position: 'absolute',
    top: -30,
    left: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dragHintText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default AIAssistantBubble;
