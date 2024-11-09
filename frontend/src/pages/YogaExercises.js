import React from 'react';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function YogaExercises() {
  const yogaCategories = [
    {
      name: "Brain Health",
      exercises: [
        { name: "Bhramari Pranayama (Humming Bee Breathing)", duration: "5-10 minutes", description: "Calms the mind, releases negative emotions, improves concentration and memory, builds confidence." },
        { name: "Paschimottanasana (Seated Forward Bend)", duration: "1-3 minutes", description: "Stretches the spine, helps relieve stress, and relaxes the mind." },
        { name: "Halasana (Plow Pose)", duration: "1-5 minutes", description: "Improves blood flow to the brain, stretches the back and neck, reduces stress and fatigue." },
        { name: "Setu Bandhasana (Bridge Pose)", duration: "1-3 minutes", description: "Strengthens and stretches the neck and spine, calms the brain, reduces anxiety, stress, and depression." },
        { name: "Sarvangasana (Shoulder Stand)", duration: "3-5 minutes", description: "Regulates thyroid and parathyroid glands, nourishes the brain, and improves cognitive functions." },
        { name: "Super Brain Yoga", duration: "1-3 minutes", description: "Increases brain power, synchronizes left and right brain, stimulates thinking capacity, improves focus, concentration, and memory." },
      ]
    },
    {
      name: "Back Pain Relief",
      exercises: [
        { name: "Lengthening the Spine", duration: "30 seconds", description: "Lifts arms, interlaces fingers, stretches up, and holds posture." },
        { name: "Twisting the Spine", duration: "30 seconds each side", description: "Twists to the right and left, holds each position." },
        { name: "Bending the Spine", duration: "30 seconds each direction", description: "Bends to the right and left, stretches forward and backward." },
        { name: "Side-to-Side Twisting", duration: "30 seconds each side", description: "Twists to each side while keeping one hand on the opposite knee." },
      ]
    },
    {
      name: "Boosting Metabolism",
      exercises: [
        { name: "Kapal Bhati Pranayama", duration: "5-10 minutes", description: "Boosts metabolic rate, stimulates abdominal organs, improves digestion, and trims the belly." },
        { name: "Eka Pada Raja Kapotasana", duration: "30-60 seconds each side", description: "Stimulates abdominal organs, enhances digestion, improves blood circulation." },
        { name: "Utkatasana", duration: "30-60 seconds", description: "Tones thighs, knees, and legs, improves body posture." },
        { name: "Ustrasana", duration: "30-60 seconds", description: "Enhances digestion, strengthens the lower back, and tones abdominal organs." },
      ]
    },
    {
      name: "Fertility",
      exercises: [
        { name: "Nadi Shodhan Pranayama (Alternate Nostril Breathing)", duration: "5-10 minutes", description: "Calms the mind and body, purifies energy channels." },
        { name: "Bhramari Pranayama (Bee Breath)", duration: "5-10 minutes", description: "Relieves tension, anger, and anxiety." },
        { name: "Paschimottanasana (Seated Forward Bend)", duration: "1-3 minutes", description: "Stimulates uterus and ovaries, relieves stress and depression." },
        { name: "Hastapadasana (Standing Forward Bend)", duration: "1-3 minutes", description: "Stretches muscles, improves blood supply to the pelvic region." },
        { name: "Janu Shirasana (One-legged Forward Bend)", duration: "1-3 minutes each side", description: "Strengthens back muscles." },
        { name: "Badhakonasana (Butterfly Pose)", duration: "1-3 minutes", description: "Stretches inner thighs and groins, ensures smooth delivery." },
        { name: "Viparita Karani (Legs Up the Wall Pose)", duration: "5-10 minutes", description: "Relieves tired legs, backache, improves blood flow to the pelvic region." },
        { name: "Yoga Nidra (Yogic Sleep)", duration: "15-30 minutes", description: "Attains equilibrium, reduces stress, prepares mind and body for conception." },
      ]
    },
    {
      name: "Arthritis Relief",
      exercises: [
        { name: "Veerbhadrasana (Warrior Pose)", duration: "30-60 seconds each side", description: "Strengthens arms, legs, and lower back, beneficial for frozen shoulders." },
        { name: "Vrikshasana (Tree Pose)", duration: "30-60 seconds each side", description: "Strengthens legs and back, improves balance." },
        { name: "Marjariasana (Cat Stretch)", duration: "1-3 minutes", description: "Brings flexibility, strength to the spine, wrists, and shoulders." },
        { name: "Setubandhasana (Bridge Pose)", duration: "30-60 seconds", description: "Strengthens back muscles, stretches neck, chest, and spine." },
        { name: "Trikonasana (Triangle Pose)", duration: "30-60 seconds each side", description: "Effective for back pain and sciatica, stretches and strengthens the spine." },
        { name: "Shavasana (Corpse Pose)", duration: "5-10 minutes", description: "Complete relaxation, repairs tissues and cells, releases stress." },
      ]
    },
    {
      name: "Shoulder Pain",
      exercises: [
        { name: "Garudasana (Eagle Pose)", duration: "30-60 seconds each side", description: "Stretches shoulders and upper back." },
        { name: "Paschim Namaskarasana (Reverse Prayer Pose)", duration: "30-60 seconds", description: "Stretches shoulder joints and pectoral muscles." },
        { name: "Ustrasana (Camel Pose)", duration: "30-60 seconds", description: "Stretches and strengthens the front of the body, relieves lower backache." },
        { name: "Dhanurasana (Bow Pose)", duration: "30-60 seconds", description: "Opens the chest, neck, and shoulders, reduces stress and fatigue." },
        { name: "Purvottanasana (Upward Plank Pose)", duration: "30-60 seconds", description: "Stretches shoulders, chest, and neck, strengthens shoulders and back." },
      ]
    },
    {
      name: "Irritable Bowel Syndrome (IBS)",
      exercises: [
        { name: "Bhramari Pranayama (Bee Breath)", duration: "5-10 minutes", description: "Relieves stress and tension." },
        { name: "Paschimottanasana (Seated Forward Bend)", duration: "1-3 minutes", description: "Stimulates digestive organs." },
        { name: "Setubandhasana (Bridge Pose)", duration: "30-60 seconds", description: "Strengthens the back, stretches the stomach." },
        { name: "Shavasana (Corpse Pose)", duration: "5-10 minutes", description: "Relaxes the entire body, aids in stress relief." },
      ]
    },
  ];

  return (
    <div className="yoga-exercises p-4">
      <h2 className="text-2xl font-bold mb-4">Yoga Exercises for Various Health Concerns</h2>
      <Accordion defaultActiveKey="0">
        {yogaCategories.map((category, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{category.name}</Accordion.Header>
            <Accordion.Body>
              <ul className="list-disc pl-5">
                {category.exercises.map((exercise, exerciseIndex) => (
                  <li key={exerciseIndex} className="mb-2">
                    <strong>{exercise.name}</strong> - {exercise.duration}
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default YogaExercises;
