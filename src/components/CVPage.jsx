import '../styles/SubPage.css';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';

export default function CVPage() {
  return (
    <div className="subpage">
        <Navbar />

        <div className='subpage-main'>

            <span className={'cvpage-title'}>BIO</span>

            <span className={'cvpage-text'}>
                Xilei Ceci Chen is a multimedia emerging artist whose practice explores feminism and family relationships 
                within the context of contemporary Chinese society. Working primarily with ceramics, digital photography, 
                and analog processes, her work examines questions of identity, displacement, and personal narrative. Drawing 
                from her lived experience between two cultures, she reflects on what it means to navigate family dynamics, 
                societal roles, and womanhood. Born and raised in Guangzhou, China, Chen moved to the United States to pursue 
                her undergraduate studies at Brandeis University, where she is currently completing a BA in Studio Art and a 
                BS in Computer Science. Her transition from a traditional Chinese educational system to an American liberal 
                arts environment deeply informs her artistic inquiry. As a student journalist and photographer for various 
                campus organizations, she remains actively engaged with student life and uses this lens to enrich her creative 
                research. Her work has been exhibited at the Dreitzer Gallery in Massachusetts and the Siena Art Institute in 
                Italy. She is currently based in the Greater Boston Area.
            </span>

            <span className={'cvpage-title'}>EXHIBITIONS</span>

            <span className={'cvpage-text'}>
                2025 &nbsp; <i>Rise Up Exhibition</i>, Dreitzer Gallery, Waltham, MA<br />
                2024 &nbsp; <i>Fall Show 2024</i>, Siena Art Institute, Siena, Italy
            </span>

            <span className={'cvpage-title'}>EDUCATION</span>
            
            <span className={'cvpage-text'}>2026 &nbsp; BA, Studio Art and BS, Computer Science, Brandeis University, Waltham, MA</span>
            
            <span className={'cvpage-title'}>RELATED EXPERIENCE</span>

            <span className={'cvpage-text'}>
                2023 – Present &nbsp; Student Photographer, Brandeis Department of Student Engagement, Waltham, MA<br />
                2023 – Present &nbsp; Student Photographer Intern, Brandeis Hillel, Waltham, MA<br />
                2022 – Present &nbsp; Associate Editor, The Justice, Waltham, MA<br />
                2022 – Present &nbsp; Photo Editor, Archon Yearbook, Waltham, MA<br />                
            </span>

            <span className={'cvpage-title'}>PUBLICATIONS</span>

            <span className={'cvpage-text'}>
                2025 &nbsp; <a href="https://www.thejustice.org/article/2025/03/brandeis-post-baccalaureate-exhibition-opens" target="_blank" rel="noopener noreferrer"> <i>Oil painting “Mishpacha”.</i> Photograph. The Justice, March 18, 2025. </a><br />
                2023 &nbsp; <a href="https://www.thejustice.org/multimedia/99eff915-3fbd-4a49-af97-d535c6b47f94" target="_blank" rel="noopener noreferrer"> <i>“Mural walls of hope.” </i> Photograph. The Justice, November 14, 2023. </a><br />
                2023 &nbsp; <a href="https://www.thejustice.org/multimedia/05ee3ed4-55a1-485f-8868-dfe07b0a90dc" target="_blank" rel="noopener noreferrer"> <i>Students protest lack of housing availability at presidential address. </i> Photograph. The Justice, May 2, 2023. </a><br />
            </span>

            <span className={'cvpage-title'}>
                <a href="/files/resume.pdf" download="Xilei Chen.pdf"> DOWNLOAD RESUME </a>
            </span>


        </div>

        <CopyrightBar />
    </div>
  );
}