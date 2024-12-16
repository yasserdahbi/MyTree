import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import Logo from '../utils/Logo';

const FamilyTree = () => {
  const navigate = useNavigate();
  const d3Container = useRef(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/family');
        console.log("Family members fetched:", response.data);
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch family members:", error);
      }
    };

    fetchFamilyMembers();
  }, []);

  useEffect(() => {
    if (members.length === 0 || !d3Container.current) return;

    console.log("Members data:", members); 

    d3.select(d3Container.current).selectAll("*").remove();

    const stratify = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.parentId);

    const root = stratify(members);
    const treeLayout = d3.tree().size([800, 500]);
    treeLayout(root);

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', 2000)
      .attr('height', 880);

    const links = svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .classed("link", true)
      .attr("x1", d => d.source.y + 50)
      .attr("y1", d => d.source.x)
      .attr("x2", d => d.target.y + 50)
      .attr("y2", d => d.target.x)
      .attr("stroke", "#555");

    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y + 50},${d.x})`);

    nodes.append("circle")
      .attr("r", 25)
      .attr("fill", "white")
      .attr("stroke", "#69b3a2");

    nodes.append("foreignObject")
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("height", 50)
      .append("xhtml:div")
      .style("width", "50px")
      .style("height", "50px")
      .style("border-radius", "50%")
      .style("overflow", "hidden")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "center")
      .append("img")
      .attr("src", d => {
        console.log("Image path:", d.data.photoPath);  // Vérifiez que le chemin de l'image est correct
        return d.data.photoPath;
      })
      .style("width", "100%")
      .style("height", "auto");

    nodes.append("text")
      .attr("dx", 30)
      .attr("dy", ".35em")
      .text(d => `${d.data.nom} ${d.data.prenom}`)
      .attr("font-size", "12px")
      .attr("text-anchor", "start");

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

    nodes.on("mouseover", (event, d) => {
      tooltip.html(`
        <strong>${d.data.nom} ${d.data.prenom}</strong><br/>
        Sexe: ${d.data.sexe}<br/>
        Date de Naissance: ${d.data.dateNaissance}<br/>
        Profession: ${d.data.profession}
      `)
      .classed("visible", true);
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.classed("visible", false);
    });

  }, [members]);

  const handleAddMember = () => {
    navigate('/treemanagementpage', { state: { step: 2 } });
  };

  const handleRestartFamily = async () => {
    try {
      await axios.post('http://localhost:3000/api/reset-family');
      navigate('/treemanagementpage');
    } catch (error) {
      console.error("Failed to reset family:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    try {
      await axios.post('http://localhost:3000/api/reset-family');
    } catch (error) {
      console.error("Failed to reset family:", error);
    }
  };

  return (
    <div className="tree-management-page">
      <Logo className="logo" />
      <button className="logout-button top-right" onClick={handleLogout}>
        Déconnexion
      </button>
      <h1 className="page-title">Voici l'arbre généalogique de votre famille </h1>
      <div ref={d3Container} className="d3-component"></div>
      <div className="buttons">
        <button className="add-member-button" onClick={handleAddMember}>Ajouter un autre membre</button>
        <button className="next-step-button" onClick={handleRestartFamily}>Recommencer avec une nouvelle famille</button>
      </div>
    </div>
  );
};

export default FamilyTree;