// AI Assistant Service using Gemini API for business analysis and Q&A

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BusinessContext {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  lowStockProducts: number;
  topProducts?: string[];
}

class AIAssistantService {
  private conversationHistory: AIMessage[] = [];
  
  /**
   * Send message to Gemini AI with business context
   */
  async sendMessage(userMessage: string, context?: BusinessContext): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    if (!GEMINI_API_KEY) {
      return this.getMockResponse(userMessage, context);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const conversationContext = this.buildConversationContext();

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${conversationContext}\n\nUser: ${userMessage}\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40,
          },
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Add AI response to history
        this.conversationHistory.push({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        });
        
        return aiResponse;
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('AI Assistant error:', error);
      return this.getMockResponse(userMessage, context);
    }
  }

  /**
   * Build system prompt with business context
   */
  private buildSystemPrompt(context?: BusinessContext): string {
    let prompt = `Bạn là trợ lý AI thông minh của cửa hàng online, chuyên hỗ trợ người bán phân tích kinh doanh và trả lời mọi câu hỏi. 
Bạn thân thiện, chuyên nghiệp và luôn đưa ra lời khuyên thực tế.

Nhiệm vụ của bạn:
- Phân tích dữ liệu kinh doanh và đưa ra insights
- Tư vấn chiến lược bán hàng, marketing
- Hỗ trợ quản lý sản phẩm, đơn hàng
- Trả lời mọi câu hỏi liên quan đến vận hành cửa hàng
- Đề xuất cải thiện hiệu quả kinh doanh`;

    if (context) {
      prompt += `\n\nThông tin kinh doanh hiện tại:
- Tổng số sản phẩm: ${context.totalProducts}
- Doanh thu: ${context.totalRevenue.toLocaleString('vi-VN')}đ
- Tổng đơn hàng: ${context.totalOrders}
- Sản phẩm sắp hết: ${context.lowStockProducts}`;
      
      if (context.topProducts && context.topProducts.length > 0) {
        prompt += `\n- Sản phẩm bán chạy: ${context.topProducts.join(', ')}`;
      }
    }

    return prompt;
  }

  /**
   * Build conversation context from history
   */
  private buildConversationContext(): string {
    if (this.conversationHistory.length === 0) return '';
    
    // Only include last 5 messages for context
    const recentHistory = this.conversationHistory.slice(-5);
    return recentHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Mock response when API key is not available
   */
  private getMockResponse(userMessage: string, context?: BusinessContext): string {
    const lowerMessage = userMessage.toLowerCase();

    // Business analysis queries
    if (lowerMessage.includes('phân tích') || lowerMessage.includes('doanh thu') || lowerMessage.includes('kinh doanh')) {
      if (context) {
        return `Dựa vào dữ liệu hiện tại, tôi thấy:\n\n📊 **Tổng quan:**\n- Bạn đang có ${context.totalProducts} sản phẩm\n- Doanh thu: ${context.totalRevenue.toLocaleString('vi-VN')}đ\n- Đơn hàng: ${context.totalOrders}\n\n💡 **Đề xuất:**\n${context.lowStockProducts > 0 ? `- Có ${context.lowStockProducts} sản phẩm sắp hết, nên nhập thêm hàng\n` : ''}${context.totalOrders < 10 ? '- Nên tăng cường marketing để thu hút khách hàng\n' : ''}${context.totalProducts < 20 ? '- Cân nhắc mở rộng danh mục sản phẩm' : '- Tập trung vào các sản phẩm bán chạy'}`;
      }
      return `Để phân tích kinh doanh chính xác, tôi cần dữ liệu về sản phẩm, doanh thu và đơn hàng của bạn. Bạn có thể cung cấp thêm thông tin không?`;
    }

    // Product management queries
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('nhập hàng') || lowerMessage.includes('kho')) {
      return `📦 **Về quản lý sản phẩm:**\n\n- Nên kiểm tra hàng tồn kho thường xuyên\n- Sản phẩm sắp hết nên nhập trước 1-2 tuần\n- Loại bỏ sản phẩm ế từ 3-6 tháng không bán\n- Tạo combo để đẩy hàng tồn\n\nBạn muốn tôi giúp gì cụ thể về sản phẩm?`;
    }

    // Marketing queries
    if (lowerMessage.includes('khách hàng') || lowerMessage.includes('marketing') || lowerMessage.includes('bán hàng')) {
      return `🎯 **Chiến lược thu hút khách:**\n\n1. **Khuyến mãi**: Tạo voucher, combo giảm giá\n2. **Social Media**: Đăng sản phẩm lên Facebook, TikTok\n3. **Chăm sóc**: Trả lời tin nhắn nhanh, tư vấn nhiệt tình\n4. **Review**: Khuyến khích khách đánh giá\n\nBạn muốn biết thêm về chiến lược nào?`;
    }

    // Pricing queries
    if (lowerMessage.includes('giá') || lowerMessage.includes('định giá')) {
      return `💰 **Về định giá:**\n\n- Giá = Chi phí + Lợi nhuận (20-50%)\n- So sánh với đối thủ\n- Giá cao = chất lượng cao\n- Dùng giá kết thúc .9 (29.900đ)\n- Tạo khuyến mãi để tăng tỷ lệ chuyển đổi\n\nBạn cần giúp định giá sản phẩm nào?`;
    }

    // Greeting
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Xin chào! 👋 Tôi là trợ lý AI của bạn.\n\nTôi có thể giúp bạn:\n✨ Phân tích dữ liệu kinh doanh\n📊 Tư vấn chiến lược bán hàng\n💡 Đề xuất cải thiện hiệu quả\n🎯 Trả lời mọi thắc mắc\n\nBạn muốn hỏi gì?`;
    }

    // Default response
    return `Tôi hiểu bạn đang hỏi về "${userMessage}". \n\nĐể tôi hỗ trợ tốt hơn, bạn có thể hỏi cụ thể về:\n- 📊 Phân tích kinh doanh\n- 📦 Quản lý sản phẩm\n- 💰 Định giá và khuyến mãi\n- 🎯 Marketing và bán hàng\n- 👥 Chăm sóc khách hàng\n\nBạn muốn biết về chủ đề nào?`;
  }

  /**
   * Get conversation history
   */
  getHistory(): AIMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get suggested questions
   */
  getSuggestedQuestions(): string[] {
    return [
      '📊 Phân tích kinh doanh của tôi',
      '💡 Làm sao để tăng doanh thu?',
      '🎯 Chiến lược marketing hiệu quả',
      '📦 Nên nhập thêm hàng gì?',
      '💰 Tạo chương trình khuyến mãi',
      '👥 Cách chăm sóc khách hàng tốt',
    ];
  }
}

export default new AIAssistantService();
