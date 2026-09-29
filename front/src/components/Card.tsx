import "./styles/Card.css";


interface CardProps {
  children: React.ReactNode;
  onClick: () => void;
}


export default function Card({
  children,
  onClick,
}: CardProps) {




return (
    <div
      className="card"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
    
        <div className="card-content">
            {children}
        </div>
    </div>
)
}