# Interactive Fill in the Blanks Quiz

Ứng dụng web tương tác để tạo và làm bài quiz điền vào chỗ trống với nhiều tính năng thú vị.

## Tính năng

- ✨ **Tạo Quiz**: Nhập câu hỏi và đáp án từ textarea với format đơn giản
- 🎯 **Drag & Drop Animation**: Hiệu ứng mượt mà khi chọn đáp án
- ✅ **Tự động kiểm tra**: Kiểm tra đáp án ngay khi điền đầy đủ
- 💾 **Lưu trữ**: Lưu và load quiz từ localStorage
- 🔄 **Retry**: Làm lại các câu hỏi sai
- 🔊 **Audio Feedback**: Âm thanh phản hồi khi làm bài
- 💪 **Motivation Messages**: Thông điệp động viên khi làm đúng/sai
- 📊 **Progress Bar**: Thanh tiến trình hiển thị tiến độ
- 📱 **Responsive Design**: Tương thích với mọi thiết bị

## Cấu trúc Project

```
/workspace/
├── index.html          # File HTML chính
├── style.css          # File CSS styling
├── script.js          # File JavaScript logic
├── assets/            # Thư mục chứa file audio
│   ├── correct.mp3    # Âm thanh khi trả lời đúng
│   ├── error.mp3      # Âm thanh khi trả lời sai
│   └── mouse.mp3      # Âm thanh khi click
└── README.md          # File hướng dẫn
```

## Cách sử dụng

### 1. Tạo Quiz

Nhập câu hỏi và đáp án vào textarea với format:

```
Câu hỏi: [Câu hỏi của bạn]
[Đáp án 1] [Đáp án 2] [Đáp án 3] ...
```

**Ví dụ:**
```
Câu hỏi: Tại sao "String" trong Java lại được thiết kế là "bất biến"?
[Đảm bảo an toàn] 🛡️ khi sử dụng chuỗi. [Tối ưu hóa bộ nhớ] 🧠
thông qua String pool. [Hỗ trợ đa luồng] 🧵 mà không cần
đồng bộ hóa. [Cải thiện hiệu suất] 🚀 khi sử dụng làm khóa
trong HashMap.
```

### 2. Làm bài

- Click vào các đáp án để điền vào chỗ trống
- Click vào chỗ trống đã điền để xóa và chọn lại
- Tự động kiểm tra khi điền đầy đủ tất cả chỗ trống

### 3. Lưu và Load Quiz

- Click "Save Quiz" để lưu quiz hiện tại
- Load quiz đã lưu từ danh sách "Saved Quizzes"
- Có thể chỉnh sửa tên hoặc xóa quiz đã lưu

## Công nghệ sử dụng

- HTML5
- CSS3 (CSS Variables, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Web Audio API

## Cách chạy

1. Mở file `index.html` trong trình duyệt web
2. Hoặc sử dụng local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (nếu có http-server)
   npx http-server
   ```
3. Truy cập `http://localhost:8000`

## Lưu ý

- Các file audio cần được đặt trong thư mục `assets/`
- Quiz được lưu trong localStorage của trình duyệt
- Format câu hỏi phải bắt đầu bằng "Câu hỏi:"
- Đáp án phải được đặt trong dấu ngoặc vuông `[]`

## License

MIT License
