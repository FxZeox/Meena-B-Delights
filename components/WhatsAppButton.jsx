import { FaWhatsapp } from 'react-icons/fa6'

const whatsappNumber = '923369364888'
const whatsappMessage =
  'Hello Meena B Delights, I want to place an order. Please guide me with the menu and delivery details.'

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Meena B Delights on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  )
}
