const gameConfig = {
  siteTitle: "父親節潛水闖關",
  version: 6,
  colors: {
    primary: "#40E0D0",
    secondary: "#87CEEB",
    accent: "#F5DEB3",
    background: "#E0F7FA",
    text: "#006064"
  },
  equipment: [
    {
      id: "mask",
      name: "蛙鏡",
      icon: "photos/mask.png",
      location: { x: 15, y: 30 },
      question: "這是一次父親節的慶祝，還記的我們精心製作的卡片嗎？",
      photos: [
        "photos/web/memory1-1.jpg"
      ]
    },
    {
      id: "snorkel",
      name: "呼吸管",
      icon: "photos/snorkel.png",
      location: { x: 75, y: 20 },
      question: "嘿嘿～猜猜我是誰～有沒有一模一樣～",
      photos: [
        "photos/web/memory2-1.jpg",
        "photos/web/memory2-2.jpg",
        "photos/web/memory2-3.jpg"
      ]
    },
    {
      id: "fins",
      name: "蛙鞋",
      icon: "photos/fins.png",
      location: { x: 50, y: 60 },
      question: "從零到一，由母親親手包裝，滿載感謝與心意。",
      photos: [
        "photos/web/memory3-1.jpg",
        "photos/web/memory3-2.jpg"
      ]
    },
    {
      id: "wetsuit",
      name: "潛水衣",
      icon: "photos/wetsuit.png",
      location: { x: 20, y: 70 },
      question: "這是我們第一次製作蛋糕，還記得當時的口味嗎？",
      photos: [
        "photos/web/memory4-1.jpg",
        "photos/web/memory4-2.jpg"
      ]
    },
    {
      id: "tank",
      name: "氣瓶",
      icon: "photos/tank.png",
      location: { x: 80, y: 65 },
      question: "轉轉～轉出小驚喜～Happy Father's Day～",
      photos: [
        "photos/web/memory5-1.jpg",
        "photos/web/memory5-2.jpg"
      ]
    },
    {
      id: "goggles",
      name: "面鏡",
      icon: "photos/goggles.png",
      location: { x: 45, y: 40 },
      question: "滿載的星辰和願望，希望您平安健康、事事順心！",
      photos: [
        "photos/web/memory6-1.jpg",
        "photos/web/memory6-2.jpg"
      ]
    }
  ],
  postcard: {
    message: "親愛的爸爸，謝謝您一直以來的陪伴與保護。祝您父親節快樂！",
    address: "全世界最棒的爸爸收",
    stamp: "2026.08.08"
  }
};

