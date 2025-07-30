import '../styles/SubPage.css';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import { getAssetPath } from '../utils/paths.js';


export default function ContactPage() {
  return (
    <div className="subpage">
        <Navbar />
        <div className='contact-main'>
            <div className='contact-content'>
                <img
                className="contact-img"
                src={getAssetPath("/images/contact-page/contact-page.webp")}
                draggable={false}
                />
                <span className={'contact-text'}>
                    For inquiries about artwork, commissions, or exhibitions: <br />
                    Email: <a href="mailto:xileicecichen@gmail.com" target="_blank" rel="noopener noreferrer">xileicecichen@gmail.com</a> <br />
                    Instagram: @xilei_ceci_chen <br />
                </span>
            </div>
        </div>
        <CopyrightBar />
    </div>
  );
}