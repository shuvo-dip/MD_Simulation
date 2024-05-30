# Polymer 

Now we will be discussing coarse grain model of polymer chain. 

### Coarse-Grain Model of Polymer Chain
1. Introduction:

- In polymer science, detailed atomistic simulations can be computationally expensive and impractical for large systems or long simulation times.
- Coarse-grain models reduce the complexity by grouping atoms into larger units called "beads" or "superatoms".

2. Basics of Coarse-Graining:

Bead Representation: Each bead represents a group of monomers or a segment of the polymer chain.
Interaction Potentials: The interactions between beads are described using effective potentials, derived from averaging out the finer details of the atomic interactions.

![singlechian](LJ_fluid/method_07/single_chain_initial.png)
System preparation: Single polymer chain

 ```{figure} LJ_fluid/method_07/polymer_single_chain.gif
:alt:
:width: 500px
:align: center
```



System preparation: Polymer blend

![gelation](LJ_fluid/method_07/polymer_blend.gif)




In order to go through step by step lets consider the simulation framework. Simulation might contains several files. But here we mainly focus on:
  - a) `run.in` -- it cpntains mostly all the informations
  - b) `system.data` -- particles, positions, bonds, angles, information


`````{admonition} [system_single_chain.data:](https://shuvo-dip.github.io/MD_Simulation/polymer.html) Single polymer system file
:class: tip
```
LAMMPS data file via write_data, version 2 Aug 2023, timestep = 0, units = lj

20 atoms
19 bonds
18 angles
1 atom types
1 bond types
1 angle types

0 21 xlo xhi
0 2 ylo yhi
0 2 zlo zhi

Masses

1 1

Atoms # full

1	1	1	0	1	1	1
2	1	1	0	2	1	1
3	1	1	0	3	1	1
4	1	1	0	4	1	1
5	1	1	0	5	1	1
6	1	1	0	6	1	1
7	1	1	0	7	1	1
8	1	1	0	8	1	1
9	1	1	0	9	1	1
10	1	1	0	10	1	1
11	1	1	0	11	1	1
12	1	1	0	12	1	1
13	1	1	0	13	1	1
14	1	1	0	14	1	1
15	1	1	0	15	1	1
16	1	1	0	16	1	1
17	1	1	0	17	1	1
18	1	1	0	18	1	1
19	1	1	0	19	1	1
20	1	1	0	20	1	1

Bonds 

1	1	1	2
2	1	2	3
3	1	3	4
4	1	4	5
5	1	5	6
6	1	6	7
7	1	7	8
8	1	8	9
9	1	9	10
10	1	10	11
11	1	12	13
12	1	13	14
13	1	14	15
14	1	15	16
15	1	16	17
16	1	17	18
17	1	18	19
18	1	19	20
19	1	11  12

Angles 

1	1	1	2	3
2	1	2	3	4
3	1	3	4	5
4	1	4	5	6
5	1	5	6	7
6	1	6	7	8
7	1	7   8	9
8	1	8	9	10
9	1	9	10	11
10	1	10	11	12
11	1	11	12	13
12	1	12	13	14
13	1	13	14	15
14	1	14	15	16
15	1	15	16	17
16	1	16	17	18
17	1	17	18	19
18	1	18	19	20
```
`````




`````{admonition} Reactive polymer blend preparation: [run.in:](https://shuvo-dip.github.io/MD_Simulation/tetramer_gel.html) LAMMPS script for a 10-particle LJ fluid
:class: tip
```
# LAMMPS Simulation Initialization

units           lj
atom_style      full

# Bond and Angle Styles
bond_style      hybrid fene
angle_style     hybrid harmonic

# Pair Styles
pair_style      hybrid lj/cut 1.122
pair_modify     shift yes
special_bonds   lj 0.0 1.0 1.0

# Neighbor Settings
neighbor        0.3 bin
neigh_modify    every 1 delay 0 one 10000

# Boundary Conditions
boundary        p p p

# Log File
log             log.nvt.txt

# Read Initial Configuration Data
read_data       system_polymer_chain.data

# Pair Coefficients
pair_coeff      * * lj/cut 1.0 1.0

# Bond Coefficients
bond_coeff      1 fene 20.0 1.5 1.0 1.0

# Angle Coefficients
angle_coeff     1 harmonic 10.0 150

# Group Definitions
comm_modify     cutoff 5.0
group           poly type 1
group           terminal type 2

# Variables
variable        temperature equal 2.0
variable        T equal 1.0
variable        F equal 1

# Replication of the System
replicate       5 5 40
write_data      larger_system.data nocoeff

# Velocity Initialization
variable        Tdamp equal 100*dt
variable        time equal step*dt
velocity        all create ${temperature} 12945

# Fixes
fix             flan all langevin ${temperature} ${temperature} ${Tdamp} 5428254
fix             fnvt all nvt temp ${temperature} ${temperature} ${Tdamp}


# Trajectory Output
dump            11 all custom 10000 traj_nvt_langevin.lammpstrj id mol type x y z vx vy vz
dump_modify     11 sort id

# Thermodynamic Output
thermo          10000
thermo_style    custom step temp pe ke ebond epair press pxx pyy pzz pxy pxz pyz spcpu

# Timestep
timestep        0.005

# Deformation Fix
fix             fixdef all deform 1 x final 0.0 35.0 y final 0.0 35.0 z final 0.0 35.0 units box

# Simulation Run
run             1000000
write_data      system_after_eq.data nocoeff
```
`````






## Binary polymer mixture

![tetramer_chain_bond](LJ_fluid/method_07/binary_mixture_sol.gif)

Fig. 3. Binary polymer mixture. 


`````{admonition} [system_terta_chain.data:](https://shuvo-dip.github.io/MD_Simulation/tetramer_gel.html) Single tetramer system file
:class: tip
```
LAMMPS data file via write_data, version 2 Aug 2023, timestep = 0, units = lj

25 atoms
23 bonds
21 angles
2 atom types
1 bond types
1 angle types

0 21 xlo xhi
0 3 ylo yhi
0 2 zlo zhi

Masses

1 1
2 1

Atoms # full

1	1	1	0	1	1	1
2	1	1	0	2	1	1
3	1	1	0	3	1	1
4	1	1	0	4	1	1
5	1	1	0	5	1	1
6	1	1	0	6	1	1
7	1	1	0	7	1	1
8	1	1	0	8	1	1
9	1	1	0	9	1	1
10	1	1	0	10	1	1
11	1	1	0	11	1	1
12	1	1	0	12	1	1
13	1	1	0	13	1	1
14	1	1	0	14	1	1
15	1	1	0	15	1	1
16	1	1	0	16	1	1
17	1	1	0	17	1	1
18	1	1	0	18	1	1
19	1	1	0	19	1	1
20	1	1	0	20	1	1
21	2	2	0	11	2	1
22	2	2	0	12	2	1
23	2	2	0	13	2	1
24	2	2	0	14	2	1
25	2	2	0	15	2	1

Bonds 

1	1	1	2
2	1	2	3
3	1	3	4
4	1	4	5
5	1	5	6
6	1	6	7
7	1	7	8
8	1	8	9
9	1	9	10
10	1	10	11
11	1	12	13
12	1	13	14
13	1	14	15
14	1	15	16
15	1	16	17
16	1	17	18
17	1	18	19
18	1	19	20
19	1	11  12
20  1   21  22
21	1	22	23
22	1	23	24
23	1	24	25

Angles 

1	1	1	2	3
2	1	2	3	4
3	1	3	4	5
4	1	4	5	6
5	1	5	6	7
6	1	6	7	8
7	1	7   8	9
8	1	8	9	10
9	1	9	10	11
10	1	10	11	12
11	1	11	12	13
12	1	12	13	14
13	1	13	14	15
14	1	14	15	16
15	1	15	16	17
16	1	16	17	18
17	1	17	18	19
18	1	18	19	20
19	1	21  22  23
20	1	22	23	24
21	1	23	24	25
```
`````



`````{admonition} Gelation: [run_gelation.in:](https://shuvo-dip.github.io/MD_Simulation/tetramer_gel.html) LAMMPS script read_data from  previously generated *system_after_eq.data* file
:class: tip
```
# LAMMPS Simulation Initialization

units           lj
atom_style      full

# Bond and Angle Styles
bond_style      hybrid fene
angle_style     hybrid harmonic

# Pair Styles
pair_style      hybrid lj/cut 4.0
pair_modify     shift yes
special_bonds   lj 0.0 1.0 1.0

# Neighbor Settings
neighbor        0.3 bin
neigh_modify    every 1 delay 0 one 10000

# Boundary Conditions
boundary        p p p

# Log File
log             log.nvt.txt

# Read Initial Configuration Data
read_data       system_after_eq.data

# Pair Coefficients
pair_coeff      1 1 lj/cut 1.0 1.0
pair_coeff      1 2 lj/cut 1.0 1.0 1.122
pair_coeff      2 2 lj/cut 1.0 1.0
# Bond Coefficients
bond_coeff      1 fene 20.0 1.5 1.0 1.0

# Angle Coefficients
angle_coeff     1 harmonic 10.0 150

# Group Definitions
comm_modify     cutoff 5.0
group           poly type 1
group           terminal type 2

# Variables
variable        temperature equal 1.0
variable        T equal 1.0
variable        F equal 1


# Velocity Initialization
variable        Tdamp equal 100*dt
variable        time equal step*dt
velocity        all create ${temperature} 12945

# Fixes
fix             flan all langevin ${temperature} ${temperature} ${Tdamp} 5428254
fix             fnvt all nvt temp ${temperature} ${temperature} ${Tdamp}


# Trajectory Output
dump            11 all custom 10000 traj_nvt_langevin.lammpstrj id mol type x y z vx vy vz
dump_modify     11 sort id

# Thermodynamic Output
thermo          10000
thermo_style    custom step temp pe ke ebond epair press pxx pyy pzz pxy pxz pyz spcpu

# Timestep
timestep        0.005


# Simulation Run
run             1000000
write_data      system_phase_separation_eq.data nocoeff


`````



