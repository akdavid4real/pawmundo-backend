/**
 * 🐾 PawMundo Comprehensive Seed Script
 * 
 * Seeds a full user profile with rich data across all tables.
 * Run: node seed-data.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Helper ──────────────────────────────────────
function daysFromNow(n) { const d = new Date(); d.setDate(d.getDate() + n); return d; }
function daysAgo(n) { return daysFromNow(-n); }
function hoursAgo(n) { const d = new Date(); d.setHours(d.getHours() - n); return d; }

async function main() {
    console.log('🌱 Starting comprehensive seed...\n');

    // ──────────────────────────────────────────────
    // 1. CREATE USER
    // ──────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('Password123!', 12);

    const user = await prisma.user.upsert({
        where: { email: 'david@pawmundo.com' },
        update: {},
        create: {
            email: 'david@pawmundo.com',
            password: hashedPassword,
            firstName: 'David',
            lastName: 'Akintunde',
            role: 'user',
            phone: '+44 7911 123456',
            address: '42 Kensington High Street, London, W8 4PT',
            isEmailVerified: true,
            lastLogin: new Date(),
        },
    });
    console.log('✅ User created:', user.email);

    // Also create a vet user for consultations/prescriptions
    const vet = await prisma.user.upsert({
        where: { email: 'drsmith@pawmundo.com' },
        update: {},
        create: {
            email: 'drsmith@pawmundo.com',
            password: hashedPassword,
            firstName: 'Sarah',
            lastName: 'Smith',
            role: 'vet',
            phone: '+44 7700 900123',
            address: '15 Harley Street, London, W1G 9QY',
            isEmailVerified: true,
            lastLogin: new Date(),
        },
    });
    console.log('✅ Vet created:', vet.email);

    // ──────────────────────────────────────────────
    // 2. CREATE PETS (3 pets)
    // ──────────────────────────────────────────────
    const buddy = await prisma.pet.create({
        data: {
            name: 'Buddy',
            species: 'dog',
            breed: 'Golden Retriever',
            age: 4,
            gender: 'male',
            weight: 32.5,
            color: 'Golden',
            ownerId: user.id,
            dateOfBirth: new Date('2022-03-15'),
            medicalNotes: 'Generally healthy. Needs regular exercise. Hip check recommended annually.',
            allergies: ['chicken', 'wheat'],
            pastIllnesses: ['kennel cough (2023)', 'ear infection (2024)'],
            surgeries: ['neutering (2023)'],
            dietaryPreferences: 'Grain-free kibble with salmon',
            dietaryRestrictions: ['chicken', 'corn', 'soy'],
            behavioralNotes: 'Very friendly and social. Loves fetch. Afraid of thunderstorms. Pulls on leash when excited.',
            emergencyContactName: 'Emma Akintunde',
            emergencyContactPhone: '+44 7911 654321',
            healthStatus: 'healthy',
        },
    });

    const luna = await prisma.pet.create({
        data: {
            name: 'Luna',
            species: 'cat',
            breed: 'British Shorthair',
            age: 2,
            gender: 'female',
            weight: 4.8,
            color: 'Blue-grey',
            ownerId: user.id,
            dateOfBirth: new Date('2024-01-20'),
            medicalNotes: 'Indoor cat. Sensitive stomach. Due for annual vaccination.',
            allergies: ['dairy'],
            pastIllnesses: ['upper respiratory infection (2024)'],
            surgeries: ['spaying (2025)'],
            dietaryPreferences: 'Wet food, fish-based',
            dietaryRestrictions: ['dairy', 'beef'],
            behavioralNotes: 'Independent but affectionate at night. Loves window perches. Hides from strangers.',
            emergencyContactName: 'Emma Akintunde',
            emergencyContactPhone: '+44 7911 654321',
            healthStatus: 'healthy',
        },
    });

    const milo = await prisma.pet.create({
        data: {
            name: 'Milo',
            species: 'dog',
            breed: 'French Bulldog',
            age: 1,
            gender: 'male',
            weight: 11.2,
            color: 'Fawn',
            ownerId: user.id,
            dateOfBirth: new Date('2025-02-10'),
            medicalNotes: 'Brachycephalic breed — monitor breathing. Mild skin sensitivity.',
            allergies: ['pollen', 'dust mites'],
            pastIllnesses: ['skin dermatitis (2025)'],
            surgeries: [],
            dietaryPreferences: 'Hypoallergenic dry food',
            dietaryRestrictions: ['grain'],
            behavioralNotes: 'Playful and stubborn. Snores heavily. Great with children. Short attention span during training.',
            emergencyContactName: 'Emma Akintunde',
            emergencyContactPhone: '+44 7911 654321',
            healthStatus: 'recovering',
        },
    });
    console.log('✅ 3 Pets created: Buddy, Luna, Milo');

    // ──────────────────────────────────────────────
    // 3. APPOINTMENTS (4 appointments)
    // ──────────────────────────────────────────────
    await prisma.appointment.createMany({
        data: [
            {
                userId: user.id, petId: buddy.id,
                vetName: 'Dr. Sarah Smith', vetClinic: 'Pawfect Health Veterinary', vetPhone: '+44 20 7946 0958', vetEmail: 'info@pawfecthealth.co.uk',
                appointmentDate: daysFromNow(7), appointmentTime: '10:00 AM',
                reason: 'Annual wellness checkup and hip evaluation',
                status: 'scheduled',
                notes: 'Bring previous X-ray records. Fasting required from midnight.',
            },
            {
                userId: user.id, petId: luna.id,
                vetName: 'Dr. James Chen', vetClinic: 'City Cat Clinic', vetPhone: '+44 20 7946 1234',
                appointmentDate: daysFromNow(14), appointmentTime: '2:30 PM',
                reason: 'Annual vaccination booster (FVRCP)',
                status: 'confirmed',
                notes: 'Luna gets stressed in carriers — use calming spray.',
            },
            {
                userId: user.id, petId: milo.id,
                vetName: 'Dr. Sarah Smith', vetClinic: 'Pawfect Health Veterinary', vetPhone: '+44 20 7946 0958',
                appointmentDate: daysAgo(5), appointmentTime: '11:00 AM',
                reason: 'Skin dermatitis follow-up',
                status: 'completed',
                notes: 'Skin improving with medicated shampoo. Continue treatment 2 more weeks.',
            },
            {
                userId: user.id, petId: buddy.id,
                vetName: 'Dr. Emily Wright', vetClinic: 'Emergency Vet 24/7', vetPhone: '+44 20 7946 9999',
                appointmentDate: daysAgo(30), appointmentTime: '9:00 PM',
                reason: 'Emergency — swallowed a small toy',
                status: 'completed',
                notes: 'X-ray showed object passed naturally. No surgery required. Monitor stool for 48 hours.',
            },
        ],
    });
    console.log('✅ 4 Appointments created');

    // ──────────────────────────────────────────────
    // 4. CONSULTATIONS (2 consultations)
    // ──────────────────────────────────────────────
    const consultation1 = await prisma.consultation.create({
        data: {
            userId: user.id, petId: buddy.id, assignedVetId: vet.id,
            veterinarianName: 'Dr. Sarah Smith',
            status: 'completed',
            scheduledDate: daysAgo(10),
            duration: 30,
            reason: 'Buddy has been scratching his ears excessively and shaking his head',
            symptoms: 'Ear scratching, head shaking, brown discharge in left ear',
            notes: 'Diagnosed with otitis externa. Prescribed ear drops.',
            prescription: 'Otomax ear drops — 5 drops in left ear twice daily for 10 days',
            followUpRequired: true,
            followUpDate: daysFromNow(5),
            consultationType: 'video',
            cost: 45.00,
            paymentStatus: 'paid',
        },
    });

    const consultation2 = await prisma.consultation.create({
        data: {
            userId: user.id, petId: milo.id, assignedVetId: vet.id,
            veterinarianName: 'Dr. Sarah Smith',
            status: 'in_progress',
            scheduledDate: daysAgo(2),
            duration: 20,
            reason: 'Milo has red patches on his belly and is licking excessively',
            symptoms: 'Red patches on belly, excessive licking, mild hair loss',
            consultationType: 'chat',
            cost: 30.00,
            paymentStatus: 'paid',
        },
    });
    console.log('✅ 2 Consultations created');

    // ── Consultation Messages ──
    await prisma.consultationMessage.createMany({
        data: [
            { consultationId: consultation2.id, senderId: user.id, senderRole: 'user', text: 'Hi Dr. Smith, Milo has been licking his belly a lot and I noticed red patches. Should I be worried?', createdAt: hoursAgo(48) },
            { consultationId: consultation2.id, senderId: vet.id, senderRole: 'doctor', text: 'Hello David! Can you send me a photo of the red patches? Also, has Milo been exposed to any new environments or foods recently?', createdAt: hoursAgo(47) },
            { consultationId: consultation2.id, senderId: user.id, senderRole: 'user', text: 'We did walk through a new park last week. The patches are about 2cm wide on his lower belly. He keeps licking them.', createdAt: hoursAgo(46) },
            { consultationId: consultation2.id, senderId: vet.id, senderRole: 'doctor', text: 'This sounds like contact dermatitis, possibly from grass or plants in the new park. I recommend a medicated shampoo. Keep him away from that park for now. Apply the cream after bathing.', createdAt: hoursAgo(45), isRead: true },
        ],
    });

    // ── Consultation Notes ──
    await prisma.consultationNote.createMany({
        data: [
            { consultationId: consultation1.id, vetId: vet.id, content: 'External ear examination reveals inflammation and brown discharge in left ear canal. Right ear clear.', noteType: 'observation' },
            { consultationId: consultation1.id, vetId: vet.id, content: 'Otitis externa — bacterial/yeast mixed infection. No signs of middle ear involvement.', noteType: 'diagnosis' },
            { consultationId: consultation1.id, vetId: vet.id, content: 'Prescribed Otomax drops. Clean ear with saline before applying drops. Recheck in 10 days.', noteType: 'treatment' },
            { consultationId: consultation2.id, vetId: vet.id, content: 'Suspected contact dermatitis. Owner reports new park exposure. Recommending topical treatment.', noteType: 'observation' },
        ],
    });

    // ── Prescriptions ──
    await prisma.prescription.createMany({
        data: [
            {
                consultationId: consultation1.id, vetId: vet.id, petOwnerId: user.id, petId: buddy.id,
                medicationName: 'Otomax Ear Drops',
                dosage: '5 drops per ear',
                frequency: 'Twice daily (morning and evening)',
                duration: '10 days',
                instructions: 'Clean ear with saline solution before applying. Massage base of ear after drops. Keep ear dry.',
                warnings: 'Discontinue if irritation worsens. Do not use if eardrum is perforated.',
                status: 'active',
            },
            {
                consultationId: consultation2.id, vetId: vet.id, petOwnerId: user.id, petId: milo.id,
                medicationName: 'Chlorhexidine Medicated Shampoo',
                dosage: 'Apply to affected areas',
                frequency: 'Every 3 days',
                duration: '3 weeks',
                instructions: 'Lather on belly and affected patches. Leave for 5-10 mins before rinsing. Pat dry gently.',
                warnings: 'Avoid contact with eyes. If rash spreads or worsens, schedule an in-person visit.',
                status: 'active',
            },
        ],
    });
    console.log('✅ Consultation messages, notes, and prescriptions created');

    // ──────────────────────────────────────────────
    // 5. MEDICATIONS (5 medications)
    // ──────────────────────────────────────────────
    await prisma.medication.createMany({
        data: [
            { petId: buddy.id, name: 'Otomax Ear Drops', dosage: '5 drops in left ear', frequency: 'daily', startDate: daysAgo(10), endDate: daysFromNow(0), instructions: 'Clean ear first with saline', veterinarian: 'Dr. Sarah Smith', isActive: true },
            { petId: buddy.id, name: 'NexGard Flea & Tick', dosage: '1 chewable tablet (68mg)', frequency: 'monthly', startDate: daysAgo(90), instructions: 'Give with food. Monthly preventative.', veterinarian: 'Dr. Sarah Smith', isActive: true },
            { petId: buddy.id, name: 'Cosequin Joint Supplement', dosage: '1 tablet', frequency: 'daily', startDate: daysAgo(180), instructions: 'For joint health maintenance. Can crush and mix with food.', veterinarian: 'Dr. Sarah Smith', isActive: true },
            { petId: luna.id, name: 'Revolution Plus', dosage: '1 topical applicator', frequency: 'monthly', startDate: daysAgo(60), instructions: 'Apply to back of neck. Keep away from other pets for 24 hours.', veterinarian: 'Dr. James Chen', isActive: true },
            { petId: milo.id, name: 'Apoquel (Oclacitinib)', dosage: '1 tablet (5.4mg)', frequency: 'daily', startDate: daysAgo(14), endDate: daysFromNow(14), instructions: 'For itch relief. Give with breakfast. Taper dose after 2 weeks.', veterinarian: 'Dr. Sarah Smith', isActive: true },
        ],
    });
    console.log('✅ 5 Medications created');

    // ──────────────────────────────────────────────
    // 6. ACTIVITIES (multiple activities for each pet)
    // ──────────────────────────────────────────────
    await prisma.activity.createMany({
        data: [
            // Buddy — walks, feeding, play
            { petId: buddy.id, type: 'walk', date: daysAgo(0), duration: 45, distance: 3.2, notes: 'Morning walk at Kensington Gardens. Buddy was very energetic!' },
            { petId: buddy.id, type: 'walk', date: daysAgo(0), duration: 30, distance: 2.1, notes: 'Evening walk around the block. Met a friendly Labrador.' },
            { petId: buddy.id, type: 'feeding', date: daysAgo(0), foodAmount: 350, notes: 'Morning meal — salmon kibble with pumpkin puree topping' },
            { petId: buddy.id, type: 'feeding', date: daysAgo(0), foodAmount: 350, notes: 'Evening meal — salmon kibble with joint supplement crushed in' },
            { petId: buddy.id, type: 'water', date: daysAgo(0), waterAmount: 800, notes: 'Good hydration today' },
            { petId: buddy.id, type: 'play', date: daysAgo(0), duration: 20, notes: 'Fetch session in the garden' },
            { petId: buddy.id, type: 'walk', date: daysAgo(1), duration: 60, distance: 4.5, notes: 'Long weekend walk at Hyde Park. Great weather!' },
            { petId: buddy.id, type: 'exercise', date: daysAgo(1), duration: 15, notes: 'Agility training in the garden — weave poles and jumps' },

            // Luna — feeding, play
            { petId: luna.id, type: 'feeding', date: daysAgo(0), foodAmount: 150, notes: 'Morning — tuna wet food' },
            { petId: luna.id, type: 'feeding', date: daysAgo(0), foodAmount: 150, notes: 'Evening — salmon wet food with hairball formula' },
            { petId: luna.id, type: 'water', date: daysAgo(0), waterAmount: 200, notes: 'Using the cat fountain' },
            { petId: luna.id, type: 'play', date: daysAgo(0), duration: 15, notes: 'Laser pointer and feather wand session' },
            { petId: luna.id, type: 'play', date: daysAgo(1), duration: 10, notes: 'Catnip toy play. Very active!' },

            // Milo — walks, feeding
            { petId: milo.id, type: 'walk', date: daysAgo(0), duration: 20, distance: 1.2, notes: 'Short gentle walk. Avoiding long walks due to brachycephalic breed in warm weather.' },
            { petId: milo.id, type: 'feeding', date: daysAgo(0), foodAmount: 200, notes: 'Morning — hypoallergenic dry food with warm water' },
            { petId: milo.id, type: 'feeding', date: daysAgo(0), foodAmount: 200, notes: 'Evening — hypoallergenic dry food' },
            { petId: milo.id, type: 'water', date: daysAgo(0), waterAmount: 400, notes: 'Good water intake' },
            { petId: milo.id, type: 'play', date: daysAgo(0), duration: 10, notes: 'Indoor play with squeaky ball. Short session due to breathing.' },
        ],
    });
    console.log('✅ 18 Activities created');

    // ──────────────────────────────────────────────
    // 7. HEALTH RECORDS (multiple for each pet)
    // ──────────────────────────────────────────────
    await prisma.healthRecord.createMany({
        data: [
            // Buddy
            { petId: buddy.id, type: 'vaccination', title: 'Rabies Vaccination', description: 'Annual rabies vaccination administered. Next due in 12 months.', date: daysAgo(60), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', nextDueDate: daysFromNow(305), weight: 32.5, cost: 35.00, isCompleted: true },
            { petId: buddy.id, type: 'vaccination', title: 'DHPP Booster', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza booster.', date: daysAgo(60), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', nextDueDate: daysFromNow(305), cost: 45.00, isCompleted: true },
            { petId: buddy.id, type: 'checkup', title: 'Annual Wellness Exam', description: 'Full physical examination. Heart, lungs, teeth, joints all normal. Weight stable. Good condition.', date: daysAgo(60), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', nextDueDate: daysFromNow(305), weight: 32.5, temperature: 38.5, heartRate: 80, cost: 65.00, isCompleted: true },
            { petId: buddy.id, type: 'dental', title: 'Dental Cleaning', description: 'Professional dental scaling and polishing. Minor tartar buildup on back molars. Teeth in good condition overall.', date: daysAgo(120), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', cost: 180.00, isCompleted: true },
            { petId: buddy.id, type: 'lab_result', title: 'Blood Panel (CBC + Chemistry)', description: 'Complete blood count and metabolic panel. All values within normal range. Liver and kidney function excellent.', date: daysAgo(60), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', cost: 95.00, isCompleted: true },
            { petId: buddy.id, type: 'treatment', title: 'Ear Infection Treatment', description: 'Left ear treated for otitis externa. Brown discharge present. Prescribed Otomax drops.', date: daysAgo(10), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', cost: 85.00, isCompleted: false },

            // Luna
            { petId: luna.id, type: 'vaccination', title: 'FVRCP Vaccination', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia vaccine.', date: daysAgo(180), veterinarian: 'Dr. James Chen', clinic: 'City Cat Clinic', nextDueDate: daysFromNow(14), cost: 40.00, isCompleted: true },
            { petId: luna.id, type: 'checkup', title: 'Kitten Wellness Check', description: 'Growth on track. Weight appropriate for age. Teeth coming in well. No heart murmur detected.', date: daysAgo(180), veterinarian: 'Dr. James Chen', clinic: 'City Cat Clinic', weight: 4.2, temperature: 38.8, heartRate: 160, cost: 55.00, isCompleted: true },
            { petId: luna.id, type: 'surgery', title: 'Spaying Procedure', description: 'Routine ovariohysterectomy performed without complications. Recovered well from anaesthesia.', date: daysAgo(90), veterinarian: 'Dr. James Chen', clinic: 'City Cat Clinic', weight: 4.5, cost: 250.00, isCompleted: true },
            { petId: luna.id, type: 'treatment', title: 'URI Treatment', description: 'Upper respiratory infection. Prescribed antibiotics and supportive care. Symptoms resolved in 7 days.', date: daysAgo(240), veterinarian: 'Dr. James Chen', clinic: 'City Cat Clinic', temperature: 39.8, cost: 75.00, isCompleted: true },

            // Milo
            { petId: milo.id, type: 'vaccination', title: 'Puppy Vaccination Series', description: 'Third and final round of puppy vaccinations. Includes DHPP and Bordetella.', date: daysAgo(200), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', nextDueDate: daysFromNow(165), weight: 9.5, cost: 55.00, isCompleted: true },
            { petId: milo.id, type: 'checkup', title: 'Brachycephalic Assessment', description: 'Breathing assessment for French Bulldog. Mild stenotic nares noted. No surgical intervention needed at this time. Monitor during exercise and hot weather.', date: daysAgo(90), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', weight: 10.8, temperature: 38.6, heartRate: 100, cost: 75.00, isCompleted: true },
            { petId: milo.id, type: 'treatment', title: 'Skin Dermatitis Treatment', description: 'Contact dermatitis on belly. Red patches, mild hair loss. Prescribed medicated shampoo and Apoquel.', date: daysAgo(14), veterinarian: 'Dr. Sarah Smith', clinic: 'Pawfect Health Veterinary', weight: 11.2, cost: 120.00, isCompleted: false, notes: 'Follow-up in 2 weeks to assess improvement.' },
        ],
    });
    console.log('✅ 13 Health Records created');

    // ──────────────────────────────────────────────
    // 8. INSURANCE (2 policies)
    // ──────────────────────────────────────────────
    const insurance1 = await prisma.insurance.create({
        data: {
            userId: user.id, petId: buddy.id,
            provider: 'PetPlan UK', policyNumber: 'PP-2024-B-78432',
            planType: 'Comprehensive Cover',
            monthlyPremium: 42.99, deductible: 100.00, coverageLimit: 12000.00,
            startDate: daysAgo(365), endDate: daysFromNow(0),
            status: 'insurance_active',
            notes: 'Covers accidents, illnesses, dental, and third-party liability. Excess £100 per condition per year.',
        },
    });

    const insurance2 = await prisma.insurance.create({
        data: {
            userId: user.id, petId: luna.id,
            provider: 'Bought By Many', policyNumber: 'BBM-2025-L-12098',
            planType: 'Complete Cover',
            monthlyPremium: 28.50, deductible: 75.00, coverageLimit: 8000.00,
            startDate: daysAgo(180), endDate: daysFromNow(185),
            status: 'insurance_active',
            notes: 'Indoor cat rate. Covers illness, accidents, dental. Cat-specific conditions covered.',
        },
    });
    console.log('✅ 2 Insurance policies created');

    // ── Insurance Claims ──
    await prisma.insuranceClaim.createMany({
        data: [
            {
                insuranceId: insurance1.id, userId: user.id,
                claimAmount: 180.00, description: 'Professional dental cleaning and scaling',
                serviceDate: daysAgo(120), provider: 'Pawfect Health Veterinary', treatmentType: 'Dental',
                status: 'approved', approvedAmount: 140.00, processedDate: daysAgo(100),
            },
            {
                insuranceId: insurance1.id, userId: user.id,
                claimAmount: 85.00, description: 'Ear infection consultation and treatment (Otomax)',
                serviceDate: daysAgo(10), provider: 'Pawfect Health Veterinary', treatmentType: 'Illness',
                status: 'processing',
            },
            {
                insuranceId: insurance2.id, userId: user.id,
                claimAmount: 250.00, description: 'Spaying procedure under general anaesthesia',
                serviceDate: daysAgo(90), provider: 'City Cat Clinic', treatmentType: 'Surgery',
                status: 'approved', approvedAmount: 225.00, processedDate: daysAgo(75),
            },
        ],
    });
    console.log('✅ 3 Insurance claims created');

    // ──────────────────────────────────────────────
    // 9. NOTIFICATIONS (10 notifications)
    // ──────────────────────────────────────────────
    await prisma.notification.createMany({
        data: [
            { userId: user.id, petId: buddy.id, title: 'Upcoming Appointment', message: 'Buddy has a wellness checkup with Dr. Sarah Smith at Pawfect Health Veterinary in 7 days.', type: 'appointment_notification', actionUrl: '/appointments', createdAt: daysAgo(0) },
            { userId: user.id, petId: buddy.id, title: 'Medication Reminder', message: 'Time to give Buddy his Otomax ear drops (5 drops in left ear). Remember to clean with saline first!', type: 'medication_notification', isRead: true, createdAt: hoursAgo(2) },
            { userId: user.id, petId: buddy.id, title: 'NexGard Due Soon', message: 'Buddy\'s monthly NexGard Flea & Tick treatment is due in 3 days.', type: 'medication_notification', createdAt: daysAgo(1) },
            { userId: user.id, petId: luna.id, title: 'Vaccination Due', message: 'Luna\'s FVRCP booster vaccination is due in 14 days. Appointment confirmed at City Cat Clinic.', type: 'vaccination', actionUrl: '/appointments', createdAt: daysAgo(1) },
            { userId: user.id, petId: milo.id, title: 'Dermatitis Follow-up', message: 'Milo\'s skin dermatitis follow-up consultation with Dr. Smith has been completed. Check notes for update.', type: 'health_alert', isRead: true, createdAt: daysAgo(5) },
            { userId: user.id, petId: milo.id, title: 'Weight Check Reminder', message: 'Milo\'s weight should be monitored — French Bulldogs are prone to obesity. Current: 11.2kg.', type: 'weight_notification', createdAt: daysAgo(7) },
            { userId: user.id, title: 'Insurance Claim Approved', message: 'Your dental cleaning claim for Buddy (£180) has been approved. £140 will be reimbursed to your account.', type: 'info', isRead: true, createdAt: daysAgo(25) },
            { userId: user.id, title: 'Insurance Claim Processing', message: 'Your ear infection claim for Buddy (£85) is being processed. Estimated completion: 5-7 business days.', type: 'info', createdAt: daysAgo(8) },
            { userId: user.id, title: 'Community Post Liked', message: 'Your forum post "Best grain-free food brands for Golden Retrievers?" received 5 new likes!', type: 'info', isRead: true, actionUrl: '/forum', createdAt: daysAgo(3) },
            { userId: user.id, petId: buddy.id, title: 'Annual Checkup Reminder', message: 'It\'s been almost a year since Buddy\'s last full checkup. Consider scheduling one soon!', type: 'checkup', actionUrl: '/appointments', createdAt: daysAgo(2) },
        ],
    });
    console.log('✅ 10 Notifications created');

    // ── Notification Preferences ──
    await prisma.notificationPreference.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            globalEnabled: true,
            emailNotifications: true,
            pushNotifications: true,
            reminderHoursBefore: 24,
            petSettings: JSON.stringify({
                [buddy.id]: { medications: true, appointments: true, health: true },
                [luna.id]: { medications: true, appointments: true, health: true },
                [milo.id]: { medications: true, appointments: true, health: true },
            }),
        },
    });
    console.log('✅ Notification preferences created');

    // ──────────────────────────────────────────────
    // 10. EVENTS (6 calendar events)
    // ──────────────────────────────────────────────
    await prisma.event.createMany({
        data: [
            { userId: user.id, petId: buddy.id, title: 'Buddy Wellness Checkup', description: 'Annual wellness exam and hip evaluation at Pawfect Health Veterinary', eventDate: daysFromNow(7), eventTime: '10:00 AM', category: 'event_appointment', location: 'Pawfect Health Veterinary, 15 Harley St', notes: 'Bring previous X-rays. Fast from midnight.' },
            { userId: user.id, petId: luna.id, title: 'Luna FVRCP Vaccination', description: 'Annual booster vaccination appointment', eventDate: daysFromNow(14), eventTime: '2:30 PM', category: 'event_vaccination', location: 'City Cat Clinic, 22 Camden High St' },
            { userId: user.id, petId: buddy.id, title: 'NexGard Treatment', description: 'Monthly flea & tick preventative', eventDate: daysFromNow(3), category: 'event_medication', isRecurring: true, recurringType: 'monthly' },
            { userId: user.id, petId: milo.id, title: 'Milo Grooming Session', description: 'Bath with medicated shampoo + nail trim', eventDate: daysFromNow(2), eventTime: '11:00 AM', category: 'grooming', location: 'Happy Paws Grooming, 8 King\'s Rd' },
            { userId: user.id, petId: buddy.id, title: 'Dog Training Class', description: 'Advanced obedience class — Week 4 of 8', eventDate: daysFromNow(5), eventTime: '4:00 PM', category: 'training', location: 'Battersea Park Training Ground', isRecurring: true, recurringType: 'weekly' },
            { userId: user.id, title: 'Pet First Aid Workshop', description: 'Community workshop on pet CPR and basic first aid techniques', eventDate: daysFromNow(21), eventTime: '10:00 AM', category: 'event_other', location: 'Kensington Community Centre' },
        ],
    });
    console.log('✅ 6 Events created');

    // ──────────────────────────────────────────────
    // 11. FORUM POSTS, REPLIES, LIKES
    // ──────────────────────────────────────────────
    const post1 = await prisma.forumPost.create({
        data: {
            title: 'Best grain-free food brands for Golden Retrievers?',
            content: 'My 4-year-old Golden Retriever, Buddy, has chicken and wheat allergies. We\'ve been using salmon-based grain-free kibble, but I\'m wondering if anyone has recommendations for other brands? He\'s 32kg and very active. Looking for something that supports joint health too. Thanks!',
            category: 'nutrition',
            authorId: user.id,
            viewCount: 47,
        },
    });

    const post2 = await prisma.forumPost.create({
        data: {
            title: 'Tips for managing a French Bulldog\'s breathing in warm weather?',
            content: 'Just got Milo, a 1-year-old Frenchie. I noticed he gets very winded on walks, especially when it\'s warm out. Any fellow Frenchie owners have tips on exercise limits, cooling techniques, or signs that I should be concerned about? His vet says his nares are only mildly stenotic.',
            category: 'health',
            authorId: user.id,
            viewCount: 32,
        },
    });

    const post3 = await prisma.forumPost.create({
        data: {
            title: 'Indoor cat enrichment ideas — keeping Luna happy',
            content: 'Luna is a 2-year-old British Shorthair who\'s strictly indoor. She gets bored easily and I want to make sure she\'s mentally stimulated. Currently I have a cat tree, window perch, and some interactive toys. What else do you recommend? Has anyone tried puzzle feeders or cat TV?',
            category: 'behavior',
            authorId: user.id,
            viewCount: 65,
        },
    });

    // Replies from the vet
    await prisma.forumReply.createMany({
        data: [
            { postId: post1.id, authorId: vet.id, content: 'Great question! For Goldens with allergies, I recommend Orijen Six Fish or Acana Singles (Salmon). Both are grain-free and rich in omega-3s which support joint health. You could also add a glucosamine supplement like Cosequin.', createdAt: daysAgo(4) },
            { postId: post2.id, authorId: vet.id, content: 'As a vet, I advise: limit walks to 15-20 mins in warm weather, always carry water, use a cooling vest, and walk during cooler morning/evening hours. If you see excessive panting, blue-tinged gums, or collapse — seek emergency vet care immediately.', createdAt: daysAgo(3) },
            { postId: post3.id, authorId: vet.id, content: 'Puzzle feeders are excellent for indoor cats! I also recommend rotating toys weekly to keep things fresh. Cat grass is great for enrichment and digestion. You might also consider a second cat for companionship, but introduce slowly.', createdAt: daysAgo(2) },
        ],
    });

    // Likes
    await prisma.forumLike.createMany({
        data: [
            { postId: post1.id, userId: vet.id },
            { postId: post3.id, userId: vet.id },
        ],
    });
    console.log('✅ 3 Forum posts, 3 replies, 2 likes created');

    // ──────────────────────────────────────────────
    // 12. SYMPTOM CHECKS (3 checks)
    // ──────────────────────────────────────────────
    await prisma.symptomCheck.createMany({
        data: [
            {
                userId: user.id, petId: buddy.id, petName: 'Buddy',
                symptoms: ['excessive ear scratching', 'head shaking', 'brown ear discharge', 'ear odour'],
                duration: '3 days',
                severity: 'moderate',
                additionalInfo: 'Only affecting left ear. No fever. Still eating and drinking normally.',
                urgencyLevel: 'moderate',
                possibleConditions: ['Otitis externa (ear infection)', 'Ear mites', 'Allergic ear disease', 'Foreign body in ear canal'],
                recommendations: ['Schedule a vet appointment within 48 hours', 'Do not insert cotton buds into the ear canal', 'Clean outer ear gently with a damp cloth', 'Monitor for signs of pain when touching the ear'],
                vetRequired: true,
                warningSignsToWatch: ['Swelling around ear', 'Loss of balance or tilting head', 'Hearing loss', 'Bleeding from ear'],
                personalizedMessage: 'Buddy\'s symptoms suggest an ear infection which is common in Golden Retrievers due to their floppy ears. This is treatable but should be seen by a vet to determine the exact cause and prescribe appropriate medication.',
                createdAt: daysAgo(12),
            },
            {
                userId: user.id, petId: milo.id, petName: 'Milo',
                symptoms: ['red patches on belly', 'excessive licking', 'mild hair loss', 'scratching'],
                duration: '5 days',
                severity: 'mild',
                additionalInfo: 'Walked through a new park last week. No change in diet. Using same shampoo.',
                urgencyLevel: 'low',
                possibleConditions: ['Contact dermatitis', 'Environmental allergies', 'Flea allergy dermatitis', 'Bacterial skin infection'],
                recommendations: ['Bathe with hypoallergenic shampoo', 'Avoid the new park temporarily', 'Use an Elizabethan collar if licking persists', 'Schedule a vet visit if no improvement in 3-5 days'],
                vetRequired: false,
                warningSignsToWatch: ['Spreading to other body areas', 'Open sores or weeping skin', 'Fever or lethargy', 'Loss of appetite'],
                personalizedMessage: 'Milo\'s symptoms are consistent with contact dermatitis, likely triggered by something in the new park. French Bulldogs have sensitive skin, so environmental triggers are common. The condition usually resolves with basic treatment.',
                createdAt: daysAgo(7),
            },
            {
                userId: user.id, petId: luna.id, petName: 'Luna',
                symptoms: ['sneezing', 'watery eyes', 'reduced appetite'],
                duration: '2 days',
                severity: 'mild',
                additionalInfo: 'Indoor cat. Windows were left open. No contact with other cats.',
                urgencyLevel: 'low',
                possibleConditions: ['Upper respiratory infection', 'Cat flu (feline herpesvirus)', 'Environmental allergies', 'Dust irritation'],
                recommendations: ['Keep Luna warm and comfortable', 'Ensure plenty of fresh water', 'Use a humidifier near her sleeping area', 'Monitor appetite — offer warm, fragrant wet food', 'If symptoms persist beyond 5 days, see a vet'],
                vetRequired: false,
                warningSignsToWatch: ['Green or yellow nasal discharge', 'Difficulty breathing', 'Complete refusal to eat for 24+ hours', 'Lethargy or hiding for extended periods'],
                personalizedMessage: 'Luna may have picked up a mild respiratory irritation from the open windows. British Shorthairs can be sensitive to drafts. Keep windows closed and monitor her — most mild cases resolve in 3-5 days.',
                createdAt: daysAgo(240),
            },
        ],
    });
    console.log('✅ 3 Symptom checks created');

    // ──────────────────────────────────────────────
    // DONE!
    // ──────────────────────────────────────────────
    console.log('\n🎉 ─────────────────────────────────────');
    console.log('🎉 Seed completed successfully!');
    console.log('🎉 ─────────────────────────────────────');
    console.log(`\n📊 Summary:`);
    console.log(`   👤 Users: 2 (1 pet owner + 1 vet)`);
    console.log(`   🐶 Pets: 3 (Buddy, Luna, Milo)`);
    console.log(`   📅 Appointments: 4`);
    console.log(`   💬 Consultations: 2 (with messages, notes, prescriptions)`);
    console.log(`   💊 Medications: 5`);
    console.log(`   🏃 Activities: 18`);
    console.log(`   🏥 Health Records: 13`);
    console.log(`   🛡️  Insurance: 2 policies + 3 claims`);
    console.log(`   🔔 Notifications: 10 + preferences`);
    console.log(`   📆 Events: 6`);
    console.log(`   💬 Forum: 3 posts + 3 replies + 2 likes`);
    console.log(`   🩺 Symptom Checks: 3`);
    console.log(`\n🔑 Login: david@pawmundo.com / Password123!`);
    console.log(`🔑 Vet:   drsmith@pawmundo.com / Password123!`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
