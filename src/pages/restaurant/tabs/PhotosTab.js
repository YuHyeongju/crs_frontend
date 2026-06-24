import React, { useState } from 'react';

const PhotosTab = ({ menus }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const photos = menus.filter(m => m.imageUrl);

    if (photos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>사진</h3>
                <div style={styles.emptyBox}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📷</div>
                    <p style={{ color: '#666', fontSize: '16px' }}>등록된 사진이 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>사진</h3>
            <div style={styles.grid}>
                {photos.map((photo) => (
                    <div key={photo.menuIdx} style={styles.cell}
                        onClick={() => setSelectedPhoto(photo)}>
                        <img src={photo.imageUrl} alt={photo.menuName} style={styles.img} />
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <div style={styles.overlay} onClick={() => setSelectedPhoto(null)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setSelectedPhoto(null)}>✕</button>
                        <img src={selectedPhoto.imageUrl} alt={selectedPhoto.menuName}
                            style={styles.modalImg} />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    emptyBox: {
        border: '2px solid #ddd', borderRadius: '8px',
        padding: '40px', backgroundColor: '#fff'
    },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px', padding: '15px', maxWidth: '600px', margin: '0 auto'
    },
    cell: {
        width: '100%', paddingBottom: '100%', position: 'relative',
        borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
        backgroundColor: '#e0e0e0'
    },
    img: {
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%', objectFit: 'cover'
    },
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
        position: 'relative', backgroundColor: '#fff', borderRadius: '12px',
        padding: '20px', textAlign: 'center', maxWidth: '480px', width: '90%'
    },
    modalImg: {
        width: '100%', maxHeight: '400px',
        objectFit: 'contain', borderRadius: '8px'
    },
    closeBtn: {
        position: 'absolute', top: '10px', right: '10px',
        width: '32px', height: '32px', borderRadius: '50%',
        backgroundColor: '#333', color: 'white', border: 'none',
        fontSize: '16px', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', lineHeight: '1'
    },
};

export default PhotosTab;
