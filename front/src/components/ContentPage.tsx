
import "./ContentPage.css";

interface ContentPageProps {
  onBack: () => void;
  children: React.ReactNode;
}

export default function ContentPage({
  onBack,
  children,
}: ContentPageProps) {



  return (
    <div className="content-page">
      <button
        className="content-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="content-page-body">
        {children}
      </div>

    </div>
  );
}