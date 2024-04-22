"use client"
import { useEffect, useState } from "react";

import { Player } from "./player.interface";

export default function Home() {

  const [playerForm, setPlayerForm] = useState({
    id: 0,
    name: "",
    surname: "",
    attack: "",
    defense: "",
    speed: "",
    strength: "",
    stamina: "",
    technique: "",
    offensive: "",
    defensive: "",
    general: ""
  })

  const [players, setPlayers] = useState<Player[]>([])
  const [team1, setTeam1] = useState<Player[]>([])
  const [team2, setTeam2] = useState<Player[]>([])
  const [playerId, setPlayerId] = useState(0)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [editPlayerId, setEditPlayerId] = useState(0)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (formSubmitted) {
      setShowForm(false)
      const timeoutId = setTimeout(() => {
        setFormSubmitted(false)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [formSubmitted])

  const formValidation = (field: keyof typeof playerForm) => {
    const fieldValue = playerForm[field]
    if (typeof fieldValue === "number") {
      if (fieldValue < 1 || fieldValue > 10 || fieldValue === null || fieldValue === undefined) {
        throw new Error("Completa todos los campos requeridos");
      }
    } else if (typeof fieldValue === "string") {
      if (fieldValue.trim() === "") {
        throw new Error("Completa todos los campos requeridos");
      }
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      formValidation('name')
      formValidation('surname')
      formValidation('attack')
      formValidation('defense')
      formValidation('speed')
      formValidation('strength')
      formValidation('stamina')
      formValidation('technique')

      if (isEdit) {
        if (editingPlayer) {
          const updatedPlayers = players.map(player =>
            player.id === editingPlayer.id ? {
              ...player,
              name: playerForm.name,
              surname: playerForm.surname,
              attack: parseFloat(playerForm.attack),
              defense: parseFloat(playerForm.defense),
              speed: parseFloat(playerForm.speed),
              strength: parseFloat(playerForm.strength),
              stamina: parseFloat(playerForm.stamina),
              technique: parseFloat(playerForm.technique),
              offensive: parseFloat(((parseFloat(playerForm.attack) + parseFloat(playerForm.speed) + parseFloat(playerForm.stamina) + parseFloat(playerForm.technique)) / 4).toFixed(1)),
              defensive: parseFloat(((parseFloat(playerForm.defense) + parseFloat(playerForm.strength) + parseFloat(playerForm.stamina) + parseFloat(playerForm.speed)) / 4).toFixed(1)),
              general: parseFloat(((parseFloat(playerForm.attack) + parseFloat(playerForm.speed) + parseFloat(playerForm.stamina) + parseFloat(playerForm.technique) + parseFloat(playerForm.strength) + parseFloat(playerForm.defense)) / 6).toFixed(1)),
            } : player
          )
          setIsEdit(false)
          setPlayers(updatedPlayers);
        } else {
          throw new Error("No se pudo encontrar el jugador que se está editando.");
        }
      } else {
        handleAddPlayer();
      }
      setFormSubmitted(true)
    } catch (error: any) {
      alert(error.message);
    }

  }

  const handleAddPlayer = () => {
    const newPlayerId = playerId + 1;
    const attack = parseFloat(playerForm.attack);
    const defense = parseFloat(playerForm.defense);
    const speed = parseFloat(playerForm.speed);
    const technique = parseFloat(playerForm.technique);
    const stamina = parseFloat(playerForm.stamina);
    const strength = parseFloat(playerForm.strength);
    const playerOff = parseFloat(((attack + speed + technique + stamina) / 4).toFixed(1));
    const playerDef = parseFloat(((defense + strength + speed + stamina) / 4).toFixed(1));
    const playerGen = parseFloat(((defense + attack + technique + strength + speed + stamina) / 6).toFixed(1))

    setPlayerId(newPlayerId);
    const newPlayer = {
      ...playerForm,
      attack,
      defense,
      speed,
      strength,
      stamina,
      technique,
      offensive: playerOff,
      defensive: playerDef,
      general: playerGen,
      id: newPlayerId
    };

    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    setPlayerForm({
      id: 0,
      name: "",
      surname: "",
      attack: "",
      defense: "",
      speed: "",
      strength: "",
      stamina: "",
      technique: "",
      offensive: "",
      defensive: "",
      general: ""
    });
  };


  const handleDelete = (id: number) => {
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers)
  }

  const handleEdit = (player: Player) => {
    setIsEdit(true)
    setEditPlayerId(player.id)
    setShowForm(true)
    setEditingPlayer(player)
    setPlayerForm(prevPlayerForm => ({
      ...prevPlayerForm,
      id: player.id,
      name: player.name,
      surname: player.surname,
      attack: player.attack.toString(),
      defense: player.defense.toString(),
      speed: player.speed.toString(),
      strength: player.strength.toString(),
      stamina: player.stamina.toString(),
      technique: player.technique.toString(),
      offensive: player.offensive.toString(),
      defensive: player.defensive.toString(),
      general: player.general.toString()
    }));
  }

  const randomizeTeams = () => {

    if (players.length / 2 !== 0) {
      throw Error("Los jugadores deben ser pares")
    }

    // Limpiar los equipos antes de asignar nuevos jugadores
    const updatedTeam1: any = []
    const updatedTeam2: any = []

    // Ordenar jugadores por su atributo "general" de forma descendente
    const sortedPlayers = [...players].sort((a, b) => b.general - a.general)

    // Agrupar los jugadores en pares
    const playerPairs: [Player, Player][] = []
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      if (i + 1 < sortedPlayers.length) {
        playerPairs.push([sortedPlayers[i], sortedPlayers[i + 1]])
      } else {
        // Si hay un número impar de jugadores, el último jugador se asigna a un equipo aleatorio
        const randomTeamIndex = Math.random() < 0.5 ? 0 : 1
        const randomTeam = randomTeamIndex === 0 ? updatedTeam1 : updatedTeam2
        randomTeam.push(sortedPlayers[i])
      }
    }

    for (let i = 0; i < playerPairs.length; i++) {
      const [player1, player2] = playerPairs[i]
      const randomTeamIndex = Math.random() < 0.5 ? 0 : 1
      const team1 = updatedTeam1
      const team2 = updatedTeam2

      if (randomTeamIndex === 0) {
        team1.push(player1)
        team2.push(player2)
      } else {
        team1.push(player2)
        team2.push(player1)
      }
    }

    setTeam1([...updatedTeam1])
    setTeam2([...updatedTeam2])
  }

  const handleMakeTeams = () => {
    randomizeTeams()
  }

  return (
    <main>
      <section className="players-dashboard">
        <form className={!showForm ? "hidden" : ""} onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="name">Nombre<span>*</span></label>
          <input type="text" id="name" minLength={2} maxLength={30} value={formSubmitted ? "" : playerForm.name}
            onChange={(e) =>
              setPlayerForm({ ...playerForm, name: e.target.value })
            } />
          <label htmlFor="surname">Apellido<span>*</span></label>
          <input type="text" id="surname" minLength={2} maxLength={30} value={formSubmitted ? "" : playerForm.surname}
            onChange={(e) =>
              setPlayerForm({ ...playerForm, surname: e.target.value })
            } />
          <label htmlFor="attack">Ataque<span>*</span></label>
          <input type="number" name="attack" min={1} max={10} value={formSubmitted ? "" : playerForm.attack} onChange={e => setPlayerForm({ ...playerForm, attack: e.target.value })} />
          <label htmlFor="defense">Defensa<span>*</span></label>
          <input type="number" name="defense" min={1} max={10} value={formSubmitted ? "" : playerForm.defense} onChange={e => setPlayerForm({ ...playerForm, defense: e.target.value })} />
          <label htmlFor="speed">Velocidad<span>*</span></label>
          <input type="number" name="speed" min={1} max={10} value={formSubmitted ? "" : playerForm.speed} onChange={e => setPlayerForm({ ...playerForm, speed: e.target.value })} />
          <label htmlFor="strength">Fuerza<span>*</span></label>
          <input type="number" name="strength" min={1} max={10} value={formSubmitted ? "" : playerForm.strength} onChange={e => setPlayerForm({ ...playerForm, strength: e.target.value })} />
          <label htmlFor="stamina">Resistencia<span>*</span></label>
          <input type="number" name="stamina" min={1} max={10} value={formSubmitted ? "" : playerForm.stamina} onChange={e => setPlayerForm({ ...playerForm, stamina: e.target.value })} />
          <label htmlFor="technique">Técnica<span>*</span></label>
          <input type="number" name="technique" min={1} max={10} value={formSubmitted ? "" : playerForm.technique} onChange={e => setPlayerForm({ ...playerForm, technique: e.target.value })} />
          <input type="submit" value={"Agregar jugador"} className={isEdit ? "hidden" : ""} />
          <input type="submit" value={"Editar jugador"} className={!isEdit ? "hidden" : ""} />
        </form>
        <div className={showForm ? "hidden" : ""}>
          {
            players.length > 0 ?
              <table>
                <tbody>
                  <tr>
                    <th>id</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Ofensiva</th>
                    <th>Defensiva</th>
                    <th>General</th>
                    <th colSpan={2}>Acciones</th>
                  </tr>

                  {players.map(player => (
                    <tr key={player.id}>
                      <td>{player.id}</td>
                      <td>{player.name}</td>
                      <td>{player.surname}</td>
                      <td>{player.offensive}</td>
                      <td>{player.defensive}</td>
                      <td>{player.general}</td>
                      <td onClick={() => handleEdit(player)}><input type="button" value={"Editar"} /></td>
                      <td onClick={() => handleDelete(player.id)}><input type="button" value={"Borrar"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              : <p>No hay jugadores</p>
          }
          <p>Recordá que para formar equipos los jugadores tienen que ser pares</p>
          <input type="button" value={isEdit ? "Editar jugador" : "Nuevo jugador"} onClick={() => setShowForm(true)} />
          <input type="button" value={"Crear equipos"} onClick={handleMakeTeams} />
          <table>
            <tbody>
              <tr>
                <th>Equipo 1</th>
                <th>Equipo 2</th>
              </tr>
              {team1 && team2 && team1.length === team2.length && team1.map((player, index) => (
                <tr key={player.id}>
                  <td>{player.name} {player?.surname}</td>
                  <td>{team2[index].name} {team2[index]?.surname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
