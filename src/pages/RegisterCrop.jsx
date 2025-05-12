// RegisterCrop.js
import { useEffect, useState } from "react";
import "./RegisterCrop.css";
import { useNavigate } from "react-router-dom";

export default function RegisterCrop() {
  const [cropName, setCropName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [cropImage, setCropImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const editData = localStorage.getItem("editCrop");
    if (editData) {
      const { name, plantingDate, harvestDate, image, index } =
        JSON.parse(editData);
      setCropName(name);
      setPlantingDate(plantingDate);
      setHarvestDate(harvestDate);
      setCropImage(image || null);
      setEditIndex(index);
      localStorage.removeItem("editCrop");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result); // base64 저장
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const plant = new Date(plantingDate);
    const harvest = new Date(harvestDate);
    if (harvest <= plant) {
      alert("수확 예정일은 심은 날짜보다 이후여야 합니다.");
      return;
    }

    const newCrop = {
      name: cropName,
      plantingDate,
      harvestDate,
      image: cropImage,
    };

    let updatedCrops = JSON.parse(localStorage.getItem("crops")) || [];

    if (editIndex !== null) {
      updatedCrops[editIndex] = newCrop;
    } else {
      updatedCrops.push(newCrop);
    }

    localStorage.setItem("crops", JSON.stringify(updatedCrops));
    alert(
      editIndex !== null ? "작물이 수정되었습니다!" : "작물이 등록되었습니다!"
    );
    navigate("/main");
  };

  return (
    <div className="register-crop-container">
      <h2>작물 등록</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          작물 이름:
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
          />
        </label>
        <label>
          심은 날짜:
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            required
          />
        </label>
        <label>
          수확 예정일:
          <input
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            required
          />
        </label>
        <label>
          작물 사진:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {cropImage && (
          <img
            src={cropImage}
            alt="미리보기"
            style={{ width: "100px", marginTop: "10px" }}
          />
        )}
        <button type="submit">
          {editIndex !== null ? "수정하기" : "등록하기"}
        </button>
      </form>
    </div>
  );
}
