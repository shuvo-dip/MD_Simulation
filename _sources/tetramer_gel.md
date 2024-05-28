# Gel Formation

Microgels are soft micron sized, crosslinked polymeric networks, that encapsulate a solvent and swell by several orders of magnitudes $\sim 10^3$ from their dry weight. The extent of swelling depends on solvent quality, the softness of the gel whilst maintaining its integrity. Thus, a gel has tunable physical properties. Also, the swelling-deswelling transition is reversible with strong hysteresis effects. The softness of these microgels is often qualitatively described by the ratio, $\varepsilon$, between elastic free energy and thermal energy $\varepsilon = \Delta F/k_B T$, and the softness can range between that of star polymers and emulsions. An estimation of the dimensionless quantity, $\varepsilon$, for a nonionic microgel of radius $R \sim 100$nm can be evaluate by the relation, $\varepsilon \equiv \Delta F/k_B T \equiv E R^3/k_B T$. Elastic modulus $E \sim k_B T/V$, where $V$ is the volume of connection units between any two crosslinks, $V= V_0 N_x$. A typical volume of one statistical unit is $V_0 \sim 1 \text{nm}^3$ and $N_x\sim 100$ statistical units present in between two crosslinking points. Thus, an estimation of $\varepsilon \sim 10^4$, which makes the microgel highly compressible. The modulus of these microgel particles depends on parameters such as crosslink density, backbone chain length, solvent quality, electrostatic interactions, the architecture (which are essentially crosslinked loops ($1^\circ, 2^\circ ~etc.$), and entanglements) of the network structure. Unlike hard-sphere fluids, which exhibits a jamming transition at packing fraction between 0.64 to 0.74, the microgel particles can achieve a much higher packing fraction owing to its softness. 
Thus, one obtains an ultra-dense state with rheological and mechanical properties different from a hard sphere system. Owing their tunable physical properties and easy synthesis protocols, microgels have been used in many applications including biotechnology, pharmaceutical, drug delivery, industrial purposes such as oil recovery, surface coating, cosmetics, food manufacturing, agricultural industry, mechanobiology, and filtration.



 In this chapter, we develop a robust computational model with {in silico} gel synthesis for reproducible structural characteristics. Microgels are typically formed due to the self-assembly in a solution of low molecular weight building blocks crosslinked to each other by reversible or non-covalent, and irreversible bonds. A typical process of gelation is shown in Fig below.

 ![gelation](LJ_fluid/method_05/gelation.png)
Fig. 1. Simulation snapshot of a typical gelation process. Four sticky terminal (reactive group) beads of star polymers are implemented in the simulation, indicated by magenta colour respectively, whereas the backbone of the teramer is denoted by green. At timestep $t=0$, polymers are dispersed randomly in the spherical cavity. At $t=100$, as the crosslinking reaction takes place, sticky beads get connected via a chemical bond. At $t=10^4$, spherical microgel forms, where few reactive groups are present and inter-molecular connections have been established.


In order to go through step by step lets consider the simulation framework. Simulation might contains several files. But here we mainly focus on:
  - a) `run.in` -- it cpntains mostly all the informations
  - b) `system.data` -- particles, positions, bonds, angles, information

## Tetramer Chain
 ![tetramer_chain](LJ_fluid/method_05/tetramer_chain.png)
 
 Fig. 2. Tetramer chain.  


`````{admonition} [system_terta_chain.data:](https://shuvo-dip.github.io/MD_Simulation/tetramer_gel.html) an Single tetramer system file
:class: tip
```
LAMMPS data file via write_data, version 2 Aug 2023, timestep = 0, units = lj

21 atoms
20 bonds
16 angles
2 atom types
1 bond types
1 angle types

-6 6 xlo xhi
-6 6 ylo yhi
0 2 zlo zhi

Masses

1 1
2 1

Atoms # full

1	1	2	0	-5	0	1	0	0	0
2	1	1	0	-4	0	1	0	0	0
3	1	1	0	-3	0	1	0	0	0
4	1	1	0	-2	0	1	0	0	0
5	1	1	0	-1	0	1	0	0	0
6	1	1	0	0	0	1	0	0	0
7	1	1	0	1	0	1	0	0	0
8	1	1	0	2	0	1	0	0	0
9	1	1	0	3	0	1	0	0	0
10	1	1	0	4	0	1	0	0	0
11	1	2	0	5	0	1	0	0	0
12	1	2	0	0	-5	1	0	0	0
13	1	1	0	0	-4	1	0	0	0
14	1	1	0	0	-3	1	0	0	0
15	1	1	0	0	-2	1	0	0	0
16	1	1	0	0	-1	1	0	0	0
17	1	1	0	0	1	1	0	0	0
18	1	1	0	0	2	1	0	0	0
19	1	1	0	0	3	1	0	0	0
20	1	1	0	0	4	1	0	0	0
21	1	2	0	0	5	1	0	0	0

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
15	1	16	6
16	1	6	17
17	1	17	18
18	1	18	19
19	1	19	20
20	1	20	21

Angles 

1	1	1	2	3
2	1	2	3	4
3	1	3	4	5
4	1	4	5	6
5	1	6	7	8
6	1	7	8	9
7	1	8	9	10
8	1	9	10	11
9	1	12	13	14
10	1	13	14	15
11	1	14	15	16
12	1	15	16	6
13	1	6	17	18
14	1	17	18	19
15	1	18	19	20
16	1	19	20	21
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
read_data       system_terta_chain.data

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

`````




![tetramer_chain_blend](LJ_fluid/method_05/tetramer_chain_blend.gif)

Movie 1. Initially single star polymer replicates 1000 times initially and shrink the box to change the density of the system.



## Chemically crosslinking process

![tetramer_chain_bond](LJ_fluid/method_05/tetramer_chain_bond.png)
 Fig. 3. Gelation process of tetramer chain. 





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
read_data       system_after_eq.data extra/bond/per/atom 2 extra/angle/per/atom 2

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

# Thermodynamic Output
thermo          1000
thermo_style    custom step temp pe ke ebond epair press pxx pyy pzz pxy pxz pyz spcpu

# Timestep
timestep        0.005

# Trajectory Output
dump            111 all custom 10000 traj_nvt_langevin_geling.lammpstrj id mol type x y z vx vy vz
dump_modify     111 sort id

# New Temperature Initialization
variable        temperature equal 1.0
velocity        all create ${temperature} 12945

# reaction
fix             5 terminal bond/create 10 2 2 1.1 1 prob 0.5 85784 iparam 2 1 jparam 2 1 atype 1

# Long Simulation Run
run             10000000
write_data      system_longtime_gel.data nocoeff

`````



![movie](LJ_fluid/method_05/tetramer_chain_gelation.gif)

Movie 2. Simulation snapshots of chemically crosslinked gelation process.





```{admonition} Gelation process as function of time:
:class: note
![gelation_process](LJ_fluid/method_05/gelation_process.png)
```

```{admonition} Mean squared displacement (MSD) during gelation process as function of time 
:class: note

![gelation_MSD](LJ_fluid/method_05/gelation_MSD.png)
```