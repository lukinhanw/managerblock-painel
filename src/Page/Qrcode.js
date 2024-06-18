import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from "../Api";

const Qrcode = () => {
    const { code } = useParams();
    const [paymentData, setPaymentData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await Api.get(`/obter-pagamento/${code}`);
                setPaymentData(response.data);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };

        fetchPaymentData();
    }, [code]);

    return (
        <div className="container mt-5">
            {paymentData ? (
                <div className="card col-12 offset-md-3 col-md-6">
                    <div className="card-body text-center">
                        <h2 className="card-title">Pagamento</h2>
                        <h5 className="card-subtitle mb-2 text-muted">Realize o pagamento via PIX</h5>
                        <img src={paymentData.qr_code} alt="QR Code" width={200} className="img-fluid my-3" />
                        <textarea rows={3} className="form-control my-3">
                            {paymentData.copiacola}
                        </textarea>
                        <div className="mb-3">
                            <CopyToClipboard text={paymentData.copiacola} onCopy={() => setCopied(true)}>
                                <button className="btn btn-outline-primary">
                                    {copied ? "PIX Copiado!" : "Copiar Código Pix"}
                                </button>
                            </CopyToClipboard>
                        </div>
                        <div className="mb-3">
                            <p className="card-text"><strong>Valor:</strong> R${paymentData.valor}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Qrcode;
