"use client"
import { useState } from "react";

import { Player } from "./player.interface";

export default function Home() {

  const [playerForm, setPlayerForm] = useState({
    id: 0,
    name: "",
    surname: "",
    attack: 0,
    defense: 0,
    speed: 0,
    strength: 0,
    stamina: 0,
    technique: 0,
    offensive: 0,
    defensive: 0,
    general: 0
  })

  const [players, setPlayers] = useState<Player[]>([])
  const [playerId, setPlayerId] = useState(0)

  const formValidation = (field: keyof typeof playerForm) => {
    const fieldValue = playerForm[field]
    if (typeof fieldValue !== 'number' || fieldValue < 1 || fieldValue > 10 || fieldValue === null || fieldValue === undefined) {
      throw new Error("Completa todos los campos requeridos");
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      formValidation('name');
      formValidation('surname');
      formValidation('attack');
      formValidation('defense');
      formValidation('speed');
      formValidation('strength');
      formValidation('stamina');
      formValidation('technique');

      handleAddPlayer();
    } catch (error: any) {
      alert(error.message);
    }

  }

  const handleAddPlayer = () => {
    const newPlayerId = playerId + 1
    const playerOff = (playerForm.attack + playerForm.speed + playerForm.technique + playerForm.stamina) / 4
    const playerDef = (playerForm.defensive + playerForm.strength + playerForm.speed + playerForm.stamina) / 4
    const playerGen = (playerForm.defensive + playerForm.attack + playerForm.technique + playerForm.strength + playerForm.speed + playerForm.stamina) / 6
    setPlayerId(newPlayerId)
    const newPlayer = {
      ...playerForm,
      offensive: playerOff,
      defensive: playerDef,
      general: playerGen,
      id: newPlayerId
    }
    setPlayers(prevPlayers => [...prevPlayers, newPlayer])
    setPlayerForm({
      id: 0,
      name: "",
      surname: "",
      attack: 0,
      defense: 0,
      speed: 0,
      strength: 0,
      stamina: 0,
      technique: 0,
      offensive: 0,
      defensive: 0,
      general: 0
    })
  }

  return (
    <main>
      <section className="players-dashboard">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nombre<span>*</span></label>
          <input type="text" id="name" minLength={2} maxLength={30} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} />
          <label htmlFor="surname">Apellido<span>*</span></label>
          <input type="text" id="surname" minLength={2} maxLength={30} onChange={e => setPlayerForm({ ...playerForm, surname: e.target.value })} />
          <label htmlFor="attack">Ataque<span>*</span></label>
          <input type="number" name="attack" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, attack: parseInt(e.target.value) })} />
          <label htmlFor="defense">Defensa<span>*</span></label>
          <input type="number" name="defense" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, defense: parseInt(e.target.value) })} />
          <label htmlFor="speed">Velocidad<span>*</span></label>
          <input type="number" name="speed" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, speed: parseInt(e.target.value) })} />
          <label htmlFor="strength">Fuerza<span>*</span></label>
          <input type="number" name="strength" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, strength: parseInt(e.target.value) })} />
          <label htmlFor="stamina">Resistencia<span>*</span></label>
          <input type="number" name="stamina" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, stamina: parseInt(e.target.value) })} />
          <label htmlFor="technique">Técnica<span>*</span></label>
          <input type="number" name="technique" min={1} max={10} onChange={e => setPlayerForm({ ...playerForm, technique: parseInt(e.target.value) })} />
          <input type="submit" value={"Agregar jugador"} />
        </form>
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
                  <th>Acciones</th>
                </tr>

                {players.map(player => (
                  <tr key={player.id}>
                    <td>{player.id}</td>
                    <td>{player.name}</td>
                    <td>{player.surname}</td>
                    <td>{player.offensive}</td>
                    <td>{player.defensive}</td>
                    <td>{player.general}</td>
                    <td>Editar</td>
                    <td>Borrar</td>
                  </tr>
                ))}
              </tbody>
            </table>
            : <p>No hay jugadores</p>
        }
      </section>
    </main>
  )
}
